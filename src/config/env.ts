import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

export interface EnvConfig {
  port: number;
}

export const env: EnvConfig = {
  port: parsePort(process.env.PORT, 3000),
};
