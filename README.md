# Pi BeatAPI Provider

The extension discovers the gateway's current public text models, base-tier retail
prices, context windows and output limits through `GET /v1/text/models`. New
models appear without another package release. Models with OpenAI and Anthropic
endpoints use Pi's native Responses, Chat Completions or Messages adapter as declared by the gateway.

```sh
pi install git:github.com/BeatAPI/pi-beatapi-provider
pi --provider beatapi --model gpt-6.1-sol
```

Configure `BEATAPI_API_KEY` privately in your environment; the provider uses it
only for generation. Model discovery is anonymous. A public model may still be
unavailable to your key's group or balance; account routing is authoritative.

The catalogue refreshes at extension startup and through Pi's provider model
refresh interface. Failed refreshes do not return an empty list over a working
catalogue; offline startup registers no models until discovery succeeds.
Unsupported endpoint families are omitted rather than routed through a guessed
protocol. The extension does not expose BeatAPI data or Web tools in Pi.

Pi's cost display is an estimate: the gateway publishes base-tier input/output
rates, but not cache rates or long-context price tiers. Missing rates and cache
estimates are displayed as zero, which does not claim that calls are free. Actual
charges come from BeatAPI usage. Unknown context/output limits fall back to
128K/32K until the gateway provides them. Discovery never sends an API key.

Local validation: `npm ci`, `npm run check`, `npm test`, `npm pack --dry-run`.
Install from GitHub; no npm release is assumed.
