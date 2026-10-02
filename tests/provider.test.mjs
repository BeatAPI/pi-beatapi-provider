import assert from "node:assert/strict";
import test from "node:test";
import { loadModels } from "../src/index.ts";

test("new models and gateway limits/prices are discovered without a release", async () => {
  const models = await loadModels(async (url, init) => {
    assert.equal(url, "https://api.beatapi.io/v1/text/models");
    assert.equal(new Headers(init.headers).has("authorization"), false);
    return Response.json({
      data: {
        object: "list",
        data: [
          {
            id: "new-model",
            family: "codex",
            endpoints: ["openai"],
            context_length: 272000,
            max_output_tokens: 64000,
            input_usd_per_million: 1.2,
            output_usd_per_million: 4.8,
            capabilities: ["Reasoning", "Vision"],
          },
          {
            id: "claude-fixture",
            family: "claude",
            endpoints: ["anthropic"],
            context_length: 0,
            max_output_tokens: 0,
          },
        ],
      },
    });
  });
  assert.equal(models[0].id, "new-model");
  assert.equal(models[0].contextWindow, 272000);
  assert.equal(models[0].cost.input, 1.2);
  assert.deepEqual(models[0].input, ["text", "image"]);
  assert.equal(models[1].api, "anthropic-messages");
  assert.ok(models[1].contextWindow > 0);
});
