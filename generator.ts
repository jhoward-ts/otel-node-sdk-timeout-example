import { BatchSpanProcessor, NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { trace, diag, DiagLogLevel } from '@opentelemetry/api';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from './logger';

const provider = new NodeTracerProvider({
  resource: new Resource({ }),
});

const gatewayExporter = new OTLPTraceExporter({
  url: 'http://localhost:3000/v1/traces',
  headers: {},
  timeoutMillis: 5 * 1000,
});

diag.setLogger(new Logger({ context: 'OtelSdk' }), DiagLogLevel.INFO);

provider.addSpanProcessor(new BatchSpanProcessor(gatewayExporter, { scheduledDelayMillis: 1 * 1000, maxQueueSize: 2048, exportTimeoutMillis: 6 * 1000 }));
provider.register();

// Function to demonstrate sending a trace
async function sendTraceExample() {
  const tracer = trace.getTracer('example-tracer');
  const span = tracer.startSpan('heartbeat-span');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  span.addEvent('heartbeat', { 
    id: uuidv4(),
    type: 'heartbeat',
    data: JSON.stringify({
      'test-data-key-1': 'test-data-value-1'
    })
  });
  
  span.addEvent('heartbeat', { 
    id: uuidv4(),
    type: 'heartbeat',
    data: JSON.stringify({
      'test-data-key-2': 'test-data-value-2'
    })
  });

  span.end();
}

(async () => {
  while (true) {
    console.log(`${new Date().toISOString()}: Sending trace`);
    await sendTraceExample();
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
  }
})();
