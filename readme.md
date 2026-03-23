### run monitoring locally
`docker-compose up -d`
open UI
`http://localhost:16686`
recommended in .env
```
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
SERVICE_NAME=email-cleaner-api
```
