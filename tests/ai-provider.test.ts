import assert from "node:assert/strict";
import test from "node:test";
import { isModelConfigured, resolveProviderConfig } from "../lib/ai-provider.ts";

test("默认 Provider 为 DeepSeek 并兼容原有环境变量", () => {
  const config = resolveProviderConfig({
    NODE_ENV: "test",
    DEEPSEEK_API_KEY: "test-deepseek-placeholder",
  });
  assert.equal(config.presetId, "deepseek");
  assert.equal(config.baseURL, "https://api.deepseek.com");
  assert.equal(config.primaryModel, "deepseek-v4-flash");
  assert.equal(config.fallbackModel, "deepseek-v4-pro");
  assert.equal(config.configured, true);
  assert.equal(isModelConfigured({ NODE_ENV: "test", DEEPSEEK_API_KEY: "test-deepseek-placeholder" }), true);
  assert.equal(isModelConfigured({ NODE_ENV: "test" }), false);
});

test("支持通过 AI_PROVIDER=gemini 与 GEMINI_API_KEY 连接 OpenAI-compatible 端点", () => {
  const config = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "gemini",
    GEMINI_API_KEY: "test-gemini-placeholder",
  });
  assert.equal(config.presetId, "gemini");
  assert.equal(config.baseURL, "https://generativelanguage.googleapis.com/v1beta/openai/");
  assert.equal(config.primaryModel, "gemini-3.5-flash");
  assert.equal(config.fallbackModel, "gemini-3.5-flash");
  assert.equal(config.configured, true);
});

test("支持 OpenRouter、Groq、Together 与自定义 OpenAI-compatible 环境变量覆盖", () => {
  const openrouter = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "openrouter",
    OPENROUTER_API_KEY: "test-or-placeholder",
  });
  assert.equal(openrouter.baseURL, "https://openrouter.ai/api/v1");
  assert.equal(openrouter.configured, true);

  const groq = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "groq",
    GROQ_API_KEY: "test-groq-placeholder",
  });
  assert.equal(groq.baseURL, "https://api.groq.com/openai/v1");
  assert.equal(groq.configured, true);

  const together = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "together",
    TOGETHER_API_KEY: "test-together-placeholder",
  });
  assert.equal(together.baseURL, "https://api.together.xyz/v1");
  assert.equal(together.configured, true);

  const custom = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "openai-compatible",
    AI_BASE_URL: "https://custom.example.com/v1",
    AI_API_KEY: "test-custom-placeholder",
    AI_MODEL: "custom-model-v1",
  });
  assert.equal(custom.baseURL, "https://custom.example.com/v1");
  assert.equal(custom.primaryModel, "custom-model-v1");
  assert.equal(custom.fallbackModel, "custom-model-v1");
  assert.equal(custom.configured, true);
});
