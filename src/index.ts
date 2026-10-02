import type {
  ExtensionAPI,
  ProviderModelConfig,
} from "@earendil-works/pi-coding-agent";

interface TextModel {
  id: string;
  family: string;
  endpoints?: string[];
  context_length?: number;
  max_output_tokens?: number;
  input_usd_per_million?: number;
  output_usd_per_million?: number;
  capabilities?: string[];
}

/** Load the gateway's public retail catalogue; never send an account key to discovery. */
export async function loadModels(
  fetcher: typeof fetch = fetch,
): Promise<ProviderModelConfig[]> {
  const response = await fetcher("https://api.beatapi.io/v1/text/models", {
    headers: { accept: "application/json" },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok)
    throw new Error(`BeatAPI model discovery failed (${response.status}).`);
  const payload = (await response.json()) as { data?: { data?: TextModel[] } };
  if (!Array.isArray(payload.data?.data))
    throw new Error("BeatAPI returned an invalid text catalogue.");
  return payload.data.data
    .filter(
      (model) =>
        model.id &&
        model.family &&
        model.endpoints?.some((endpoint) =>
          ["openai", "openai-response", "anthropic"].includes(endpoint),
        ),
    )
    .map((model) => {
      const capabilities = model.capabilities ?? [];
      const rate = (value: number | undefined) =>
        typeof value === "number" && Number.isFinite(value) && value >= 0
          ? value
          : 0;
      return {
        id: model.id,
        name: `${model.id} via BeatAPI`,
        api: model.endpoints?.includes("anthropic")
          ? "anthropic-messages"
          : model.endpoints?.includes("openai-response")
            ? "openai-responses"
            : "openai-completions",
        reasoning: capabilities.some((tag) => /reason|think/i.test(tag)),
        input: capabilities.some((tag) => /vision|image/i.test(tag))
          ? ["text", "image"]
          : ["text"],
        cost: {
          input: rate(model.input_usd_per_million),
          output: rate(model.output_usd_per_million),
          cacheRead: 0,
          cacheWrite: 0,
        },
        contextWindow:
          model.context_length && model.context_length > 0
            ? model.context_length
            : 128_000,
        maxTokens:
          model.max_output_tokens && model.max_output_tokens > 0
            ? model.max_output_tokens
            : 32_768,
      };
    });
}

export default async function registerBeatAPI(pi: ExtensionAPI): Promise<void> {
  let models: ProviderModelConfig[] = [];
  try {
    models = await loadModels();
  } catch {
    console.warn(
      "BeatAPI catalogue unavailable. Refresh provider models when connectivity returns.",
    );
  }
  pi.registerProvider("beatapi", {
    name: "BeatAPI",
    baseUrl: "https://api.beatapi.io/v1",
    apiKey: "$BEATAPI_API_KEY",
    api: "openai-responses",
    models,
    refreshModels: () => loadModels(),
  });
}
