import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

/** Prices are BeatAPI USD per million tokens, snapshot checked 2026-09-23. */
const models = [
  {
    id: 'gpt-5.6-sol',
    name: 'GPT-5.6 Sol via BeatAPI',
    reasoning: true,
    input: ['text', 'image'] as const,
    cost: { input: 2, output: 12, cacheRead: 0.2, cacheWrite: 2.5 },
    contextWindow: 1_050_000,
    maxTokens: 128_000,
  },
  {
    id: 'gpt-5.6-terra',
    name: 'GPT-5.6 Terra via BeatAPI',
    reasoning: true,
    input: ['text', 'image'] as const,
    cost: { input: 1, output: 6, cacheRead: 0.1, cacheWrite: 1.25 },
    contextWindow: 1_050_000,
    maxTokens: 128_000,
  },
  {
    id: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna via BeatAPI',
    reasoning: true,
    input: ['text', 'image'] as const,
    cost: { input: 0.08, output: 0.48, cacheRead: 0.008, cacheWrite: 0.1 },
    contextWindow: 1_050_000,
    maxTokens: 128_000,
  },
];

export default function registerBeatAPI(pi: ExtensionAPI): void {
  pi.registerProvider('beatapi', {
    name: 'BeatAPI',
    baseUrl: 'https://api.beatapi.io/v1',
    apiKey: '$BEATAPI_API_KEY',
    api: 'openai-responses',
    models: models.map((model) => ({ ...model, input: [...model.input] })),
  });
}
