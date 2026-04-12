---
title: OpenTelemetry Plugin - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenTelemetry Plugin - ElysiaJS

  - - meta
    - name: 'description'
      content: Plugin for Elysia that adds support for OpenTelemetry. Start by installing the plugin with "bun add @elysiajs/opentelemetry".

  - - meta
    - name: 'og:description'
      content: Plugin for Elysia that adds support for OpenTelemetry. Start by installing the plugin with "bun add @elysiajs/opentelemetry".
---

# OpenTelemetry

::: tip
This page is a **config reference** for **OpenTelemetry**. If you're looking to set up and integrate with OpenTelemetry, we recommend taking a look at [Integrate with OpenTelemetry](/patterns/opentelemetry) instead.
:::

To start using OpenTelemetry, install `@elysiajs/opentelemetry` and apply plugin to any instance.

```typescript twoslash
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter()
				)
			]
		})
	)
```

![jaeger showing collected trace automatically](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry will **collect spans from any library compatible with the OpenTelemetry standard**, and will apply parent and child span automatically.

## Usage
See [opentelemetry](/patterns/opentelemetry) for usage and utilities

## Config
This plugin extends OpenTelemetry SDK parameters options.

Below is a config which is accepted by the plugin

### autoDetectResources - boolean
Detect resources automatically from the environment using the default resource detectors.

default: `true`

### contextManager - ContextManager
Use a custom context manager.

default: `AsyncHooksContextManager`

### textMapPropagator - TextMapPropagator
Use a custom propagator.

default: `CompositePropagator` using W3C Trace Context and Baggage

### metricReader - MetricReader
Add a MetricReader that will be passed to the MeterProvider.

### views - View[]
A list of views to be passed to the MeterProvider.

Accepts an array of View-instances. This parameter can be used to configure explicit bucket sizes of histogram metrics.

### instrumentations - (Instrumentation | Instrumentation[])[]
Configure instrumentations.

By default `getNodeAutoInstrumentations` is enabled, if you want to enable them you can use either metapackage or configure each instrumentation individually.

default: `getNodeAutoInstrumentations()`

### resource - IResource
Configure a resource.

Resources may also be detected by using the autoDetectResources method of the SDK.

### resourceDetectors - Array<Detector | DetectorSync>
Configure resource detectors. By default, the resource detectors are [envDetector, processDetector, hostDetector]. NOTE: In order to enable the detection, the parameter autoDetectResources has to be true.

If resourceDetectors was not set, you can also use the environment variable OTEL_NODE_RESOURCE_DETECTORS to enable only certain detectors, or completely disable them:

- env
- host
- os
- process
- serviceinstance (experimental)
- all - enable all resource detectors above
- none - disable resource detection

For example, to enable only the env, host detectors:

```bash
export OTEL_NODE_RESOURCE_DETECTORS="env,host"
```

### sampler - Sampler
Configure a custom sampler. By default, all traces will be sampled.

### serviceName - string
Namespace to be identified as.

### spanProcessors - SpanProcessor[]
An array of span processors to register to the tracer provider.

### traceExporter - SpanExporter
Configure a trace exporter. If an exporter is configured, it will be used with a `BatchSpanProcessor`.

If an exporter OR span processor is not configured programmatically, this package will auto setup the default otlp exporter with http/protobuf protocol with a BatchSpanProcessor.

### spanLimits - SpanLimits
Configure tracing parameters. These are the same trace parameters used to configure a tracer.

### headersToSpanAttributes
HTTP header names (case-insensitive) to capture as span attributes.

```typescript
headersToSpanAttributes?: {
	requestHeaders?: string[]
	responseHeaders?: string[]
}
```

- Header names are **case-insensitive**.
- Use `"*"` in either list to capture **all** headers — useful for development but may include sensitive values.
- Including `"cookie"` in `requestHeaders` also emits `http.request.cookie` when `context.cookie` is present.

default: `undefined` (no headers recorded)

::: warning
This is a **breaking change** from previous versions where all headers were recorded by default. To restore the old behavior, use:

```typescript
opentelemetry({
	headersToSpanAttributes: {
		requestHeaders: ['*'],
		responseHeaders: ['*']
	}
})
```
:::

**Example: capture specific headers**

```typescript
opentelemetry({
	headersToSpanAttributes: {
		requestHeaders: ['content-type', 'accept', 'x-request-id'],
		responseHeaders: ['content-type']
	}
})
```

### spanUrlRedaction
Redact credentials and sensitive query parameter values from `url.full` and `url.query` span attributes.

```typescript
spanUrlRedaction?: false | {
	stripCredentials?: boolean
	sensitiveQueryParams?: string[]
}
```

- **Default (omitted):** redacts values of known sensitive query keys (`token`, `password`, `secret`, `api_key`, etc.) to `[REDACTED]`, and strips `user:pass@` credentials from `url.full`.
- `false`: disables all URL redaction (raw URLs recorded as-is).
- `{ stripCredentials: false }`: keeps credentials in URLs while still redacting sensitive query params.
- `{ sensitiveQueryParams: ['my-key'] }`: adds custom keys to the builtin set.

default: enabled (redacts sensitive query params and strips credentials)

**Example: add custom sensitive params**

```typescript
opentelemetry({
	spanUrlRedaction: {
		sensitiveQueryParams: ['session_token', 'private_key']
	}
})
```

### recordBody
Record request and/or response body content on spans.

```typescript
recordBody?: boolean | {
	request?: boolean
	response?: boolean
}
```

- `true`: record both request and response bodies (`http.request.body`, `http.response.body`, and their `.size` counterparts).
- `{ request: true }` or `{ response: true }`: record only one side.
- `false` / omitted: no body content recorded.

default: `false`

::: warning
Body recording can produce large span attributes. Use selectively, especially in production environments.
:::

**Example: record request bodies only**

```typescript
opentelemetry({
	recordBody: { request: true }
})
```

## Always-on attributes

The following standard [OpenTelemetry HTTP semantic convention](https://opentelemetry.io/docs/specs/semconv/http/http-spans/) attributes are **always emitted** when their respective headers are present, and do not require any configuration:

- `user_agent.original` — from the `User-Agent` request header
- `http.request_content_length` — from the `Content-Length` request header
