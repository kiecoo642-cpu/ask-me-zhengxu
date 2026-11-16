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
  assert.equal(config.primaryModel, "gemini-4-hydrogen");
  assert.equal(config.fallbackModel, "gemini-4-hydrogen");
  assert.equal(config.configured, true);
});

test("支持 OpenRouter、Groq、Together、NVIDIA NIM、Z.ai GLM 与自定义覆盖", () => {
  const openrouter = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "openrouter",
    OPENROUTER_API_KEY: "test-or-placeholder",
  });
  assert.equal(openrouter.baseURL, "https://openrouter.ai/api/v1");
  assert.equal(openrouter.primaryModel, "openrouter/free");
  assert.equal(openrouter.configured, true);

  const groq = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "groq",
    GROQ_API_KEY: "test-groq-placeholder",
  });
  assert.equal(groq.baseURL, "https://api.groq.com/openai/v1");
  assert.equal(groq.primaryModel, "openai/gpt-oss-120b");
  assert.equal(groq.configured, true);

  const together = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "together",
    TOGETHER_API_KEY: "test-together-placeholder",
  });
  assert.equal(together.baseURL, "https://api.together.xyz/v1");
  assert.equal(together.configured, true);

  const nvidia = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "nvidia",
    NVIDIA_API_KEY: "test-nvidia-placeholder",
  });
  assert.equal(nvidia.baseURL, "https://integrate.api.nvidia.com/v1");
  assert.equal(nvidia.primaryModel, "nvidia/nemotron-3");
  assert.equal(nvidia.configured, true);

  const zai = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "zai",
    ZAI_API_KEY: "test-zai-placeholder",
  });
  assert.equal(zai.baseURL, "https://api.z.ai/api/paas/v4/");
  assert.equal(zai.primaryModel, "glm-4.7-flash");
  assert.equal(zai.configured, true);

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
