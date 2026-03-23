import express, { type NextFunction, type Request, type Response } from 'express';
import { startOtel } from "./config/otel";
import { loggerMiddleware } from "./middleware/loggerMiddleware";
import { logWithTrace } from "./utils/logger";

const app = express();
startOtel();

app.use(express.json());
app.use(loggerMiddleware);

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  const message = error instanceof Error ? error.message : 'Internal server error';
  logWithTrace("error", "Error handler", {
    error: error instanceof Error ? error.stack : 'No stack trace',
    message: message
  });
  res.status(500).json({ success: false, message });
});

export default app;
