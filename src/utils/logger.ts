import pino from "pino";
import { context, trace } from "@opentelemetry/api";

export const logger = pino({
  level: "info",
  base: null, // cleaner logs
});

/**
 * Attach trace + span context to logs
 */
export const logWithTrace = (level: "info" | "error" | "warn", message: string, meta: any = {}) => {
  const span = trace.getSpan(context.active());

  const traceMeta = span
    ? {
        traceId: span.spanContext().traceId,
        spanId: span.spanContext().spanId,
      }
    : {};

  logger[level]({
    message,
    ...traceMeta,
    ...meta,
  });
};