## Running

Requires bun.

`bun install`

Run these in two separate shells to see the interaction.
`bun run ./timeout-server.ts`
`bun run ./generator.ts`

I was surprised to see timeout errors without retries:
![alt text](/screenshots/timeout-errors.png)
And to see that the spans which failed to export / process do not seem to remain in the processor, and are immediately lost:
![alt text](/screenshots/received-spans.png)

Per the documentation here, https://github.com/open-telemetry/opentelemetry-proto/blob/main/docs/specification.md#all-other-responses, I assumed the spans would be retried, and the processor would hold them until they were successfully processed, at least until the max buffer size. 

I'm not sure if this is a bug or misunderstanding on my part. Our http endpoints get transient timeouts, and instant loss is pretty detrimental to our use case. Can I change my configuration to avoid this, or will I need to implement my own batch processor or exporter?
