# Pi BeatAPI Provider

Installable Pi extension that registers BeatAPI's GPT-5.6 Sol, Terra, and Luna
text models over the OpenAI Responses API. The extension reads
`BEATAPI_API_KEY` from the environment; it neither stores nor logs the key.

This is a scoped first release. It does not auto-discover all account-enabled
models, offer `/login`, or expose BeatAPI's Data/Tool APIs as Pi tools.

## Install and run

```bash
export BEATAPI_API_KEY="<your private BeatAPI key>"
pi install git:github.com/BeatAPI/pi-beatapi-provider
pi --provider beatapi --model gpt-5.6-terra
```

Before choosing a model, confirm the exact ID is enabled for your account with
`GET https://api.beatapi.io/v1/models`. For local checkout testing, run
`pi -e . --list-models beatapi` from this repo with `BEATAPI_API_KEY` set.

Pi's displayed cost is an estimate using BeatAPI's 2026-09-23 base-tier USD
price snapshot per million tokens. The GPT-5.6 family has a higher price tier
above 272K input tokens that Pi's single `cost` row cannot represent. Pricing
may change; [current BeatAPI pricing](https://beatapi.io/pricing) and the BeatAPI
usage ledger are the source of truth. No model is claimed to be free.

Pi executes extensions with local user permissions. Review this package's
source before installation. It only registers a provider and does not perform
network requests at startup.
