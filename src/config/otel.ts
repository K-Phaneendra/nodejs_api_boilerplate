import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { logWithTrace } from "../utils/logger";

const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

export const otelSDK = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: "email-cleaner-api",
  }),
});

export const startOtel = () => {
  otelSDK.start();
  logWithTrace("info", "OpenTelemetry initialized");
};