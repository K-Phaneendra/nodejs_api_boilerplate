import app from './app';
import { env } from './config/env';
import { logWithTrace } from "./utils/logger";

const server = app.listen(env.port, () => {
  logWithTrace("info", "Server started", {
    port: env.port,
  });
});

server.on('error', (error: Error | unknown) => {
  logWithTrace("error", "Failed to start server, exiting...", { error: error instanceof Error ? error.stack : 'No stack trace' });
});
