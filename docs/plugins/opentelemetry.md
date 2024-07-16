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

Elysia OpenTelemetry is will **collect span of any library compatible OpenTelemetry standard**, and will apply parent and child span automatically.

In the code above, we apply `Prisma` to trace how long each query took.

By applying OpenTelemetry, Elysia will then:
- collect telemetry data
- Grouping relevant lifecycle together
- Measure how long each function took
- Instrument HTTP request and response
- Collect error and exception

You may export telemetry data to Jaeger, Zipkin, New Relic, Axiom or any other OpenTelemetry compatible backend.

![axiom showing collected trace from OpenTelemetry](/blog/elysia-11/axiom.webp)

Here's an example of exporting telemetry to [Axiom](https://axiom.co)
```typescript twoslash
const Bun = {
	env: {
		AXIOM_TOKEN: '',
		AXIOM_DATASET: ''
	}
}
// ---cut---
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter({
						url: 'https://api.axiom.co/v1/traces', // [!code ++]
						headers: { // [!code ++]
						    Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`, // [!code ++]
						    'X-Axiom-Dataset': Bun.env.AXIOM_DATASET // [!code ++]
						} // [!code ++]
					})
				)
			]
		})
	)
```

## OpenTelemetry SDK
Elysia OpenTelemetry is for applying OpenTelemetry to Elysia server only.

You may use OpenTelemetry SDK normally, and the span is run under Elysia's request span, it will be automatically appear in Elysia trace.

However, we also provide a `getTracer`, and `record` utility to collect span from any part of your application.

```typescript twoslash
const db = {
	query(query: string) {
		return new Promise<unknown>((resolve) => {
			resolve('')
		})
	}
}
// ---cut---
import { Elysia } from 'elysia'
import { record } from '@elysiajs/opentelemetry'

export const plugin = new Elysia()
	.get('', () => {
		return record('database.query', () => {
			return db.query('SELECT * FROM users')
		})
	})
```

## Record utility
`record` is an equivalent to OpenTelemetry's `startActiveSpan` but it will handle auto-closing and capture exception automatically.

You may think of `record` as a label for your code that will be shown in trace.

### Prepare your codebase for observability
Elysia OpenTelemetry will group lifecycle and read the **function name** of each hook as the name of the span.

It's a good time to **name your function**.

If your hook handler is an arrow function, you may refactor it to named function to understand the trace better otherwise, your trace span will be named as `anonymous`.

```typescript
const bad = new Elysia()
	// ⚠️ span name will be anonymous
	.derive(async ({ cookie: { session } }) => {
		return {
			user: await getProfile(session)
		}
	})

const good = new Elysia()
	// ✅ span name will be getProfile
	.derive(async function getProfile({ cookie: { session } }) {
		return {
			user: await getProfile(session)
		}
	})
```

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
Namespace to be identify as.

### spanProcessors - SpanProcessor[]
An array of span processors to register to the tracer provider.

### traceExporter - SpanExporter
Configure a trace exporter. If an exporter is configured, it will be used with a `BatchSpanProcessor`.

If an exporter OR span processor is not configured programmatically, this package will auto setup the default otlp exporter with http/protobuf protocol with a BatchSpanProcessor.

### spanLimits - SpanLimits
Configure tracing parameters. These are the same trace parameters used to configure a tracer.
