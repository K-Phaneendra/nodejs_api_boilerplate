import fs from "fs";
import path from "path";

const BASE_PATH = path.join(process.cwd(), "database");

// Simple in-memory lock map to prevent concurrent writes
const fileLocks: Record<string, boolean> = {};

/**
 * Ensure file exists, else create with default data
 */
const ensureFileExists = async <T>(filePath: string, defaultData: T) => {
  try {
    await fs.promises.access(filePath);
  } catch {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
};

/**
 * Acquire lock (basic mutex)
 */
const acquireLock = async (filePath: string) => {
  while (fileLocks[filePath]) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  fileLocks[filePath] = true;
};

/**
 * Release lock
 */
const releaseLock = (filePath: string) => {
  fileLocks[filePath] = false;
};

/**
 * Read JSON file
 */
export const readJsonFile = async <T>(
  fileName: string,
  defaultData: T
): Promise<T> => {
  const filePath = path.join(BASE_PATH, fileName);

  await ensureFileExists(filePath, defaultData);

  const data = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(data) as T;
};

/**
 * Write JSON file (overwrite)
 */
export const writeJsonFile = async <T>(
  fileName: string,
  data: T
): Promise<void> => {
  const filePath = path.join(BASE_PATH, fileName);

  await ensureFileExists(filePath, data);

  await acquireLock(filePath);
  try {
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } finally {
    releaseLock(filePath);
  }
};

/**
 * Update JSON file using updater function
 */
export const updateJsonFile = async <T>(
  fileName: string,
  defaultData: T,
  updater: (data: T) => T
): Promise<T> => {
  const filePath = path.join(BASE_PATH, fileName);

  await ensureFileExists(filePath, defaultData);

  await acquireLock(filePath);
  try {
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const currentData = JSON.parse(raw) as T;

    const updatedData = updater(currentData);

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(updatedData, null, 2),
      "utf-8"
    );

    return updatedData;
  } finally {
    releaseLock(filePath);
  }
};

/**
 * Append item to array JSON file
 */
export const appendToJsonArray = async <T>(
  fileName: string,
  defaultData: T[],
  newItem: T
): Promise<T[]> => {
  return updateJsonFile<T[]>(
    fileName,
    defaultData,
    (data) => [...data, newItem]
  );
};