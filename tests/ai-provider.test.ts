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

test("支持 2026-11-17 新增的 9 个免费 OpenAI-compatible Provider 预设且默认未激活", () => {
  const cases = [
    { id: "sambanova", keyEnv: "SAMBANOVA_API_KEY", baseURL: "https://api.sambanova.ai/v1", primary: "DeepSeek-V3.1", fallback: "gpt-oss-120b" },
    { id: "amd", keyEnv: "RADEON_API_KEY", baseURL: "https://developer.amd.com.cn/radeon/api/v1", primary: "DeepSeek-V4-Flash", fallback: "DeepSeek-V4.1-Flash" },
    { id: "novita", keyEnv: "NOVITA_API_KEY", baseURL: "https://api.novita.ai/openai", primary: "apodex/apodex-1.1-mini", fallback: "apodex/apodex-1.1-mini" },
    { id: "merkium", keyEnv: "MERKIUM_API_KEY", baseURL: "https://chat.merkium.nl/api/v1", primary: "ganymede-1.1", fallback: "pluto-1.2-pro" },
    { id: "hetzner", keyEnv: "HETZNER_API_KEY", baseURL: "https://inference.hetzner.com/api/v1", primary: "Qwen/Qwen3.6-35B-A3B-FP8", fallback: "Qwen3.8-27B" },
    { id: "unorouter", keyEnv: "UNOROUTER_API_KEY", baseURL: "https://api.unorouter.com/v1", primary: "gemini-3.8-flash:free", fallback: "gemini-3.8-flash:free" },
    { id: "llmkiwi", keyEnv: "LLM_KIWI_API_KEY", baseURL: "https://api.llm.kiwi/v1", primary: "auto", fallback: "auto" },
    { id: "maritaca", keyEnv: "MARITACA_API_KEY", baseURL: "https://chat.maritaca.ai/api", primary: "S5-free", fallback: "S5-free" },
    { id: "cheapllm", keyEnv: "CHEAPLLM_API_KEY", baseURL: "https://cheapllm.shop/v1", primary: "deepseek-v4.1-flash-1017", fallback: "deepseek-v4.1-flash-1017" },
  ] as const;

  for (const item of cases) {
    const unconfigured = resolveProviderConfig({ NODE_ENV: "test", AI_PROVIDER: item.id });
    assert.equal(unconfigured.configured, false);

    const configured = resolveProviderConfig({
      NODE_ENV: "test",
      AI_PROVIDER: item.id,
      [item.keyEnv]: "test-placeholder-key",
    });
    assert.equal(configured.presetId, item.id);
    assert.equal(configured.baseURL, item.baseURL);
    assert.equal(configured.primaryModel, item.primary);
    assert.equal(configured.fallbackModel, item.fallback);
    assert.equal(configured.configured, true);
  }
});

test("支持 2026-11-18 新增的 3 个免费 OpenAI-compatible Provider 预设且默认未激活", () => {
  const cases = [
    { id: "exaone", keyEnv: "EXAONE_API_KEY", baseURL: "https://api.exaone.ai/v1", primary: "k-exaone_v2.5", fallback: "k-exaone_v2.5" },
    { id: "requesty", keyEnv: "REQUESTY_API_KEY", baseURL: "https://router.requesty.ai/v1", primary: "gemma-4-31b-it", fallback: "nemotron-3-ultra-550b-a55b" },
    { id: "zro", keyEnv: "ZRO_API_KEY", baseURL: "https://zro.moonmath.ai/v1", primary: "deepseek-v4.1-flash", fallback: "deepseek-v4.1-flash" },
  ] as const;

  for (const item of cases) {
    const unconfigured = resolveProviderConfig({ NODE_ENV: "test", AI_PROVIDER: item.id });
    assert.equal(unconfigured.configured, false);

    const configured = resolveProviderConfig({
      NODE_ENV: "test",
      AI_PROVIDER: item.id,
      [item.keyEnv]: "test-placeholder-key",
    });
    assert.equal(configured.presetId, item.id);
    assert.equal(configured.baseURL, item.baseURL);
    assert.equal(configured.primaryModel, item.primary);
    assert.equal(configured.fallbackModel, item.fallback);
    assert.equal(configured.configured, true);
  }
});

test("支持 2026-11-18 晚间新增的 AIHubMix 与 Free.ai 预设且默认未激活", () => {
  const cases = [
    { id: "aihubmix", keyEnv: "AIHUBMIX_API_KEY", baseURL: "https://aihubmix.com/v1", primary: "gpt-4.1-free", fallback: "gpt-4.1-free" },
    { id: "freeai", keyEnv: "FREEAI_API_KEY", baseURL: "https://api.free.ai/v1", primary: "qwen7b", fallback: "qwen7b" },
  ] as const;

  for (const item of cases) {
    const unconfigured = resolveProviderConfig({ NODE_ENV: "test", AI_PROVIDER: item.id });
    assert.equal(unconfigured.configured, false);

    const configured = resolveProviderConfig({
      NODE_ENV: "test",
      AI_PROVIDER: item.id,
      [item.keyEnv]: "test-placeholder-key",
    });
    assert.equal(configured.presetId, item.id);
    assert.equal(configured.baseURL, item.baseURL);
    assert.equal(configured.primaryModel, item.primary);
    assert.equal(configured.fallbackModel, item.fallback);
    assert.equal(configured.configured, true);
  }

  const aliasFreeAi = resolveProviderConfig({
    NODE_ENV: "test",
    AI_PROVIDER: "free.ai",
    FREEAI_API_KEY: "test-placeholder-key",
  });
  assert.equal(aliasFreeAi.presetId, "freeai");
  assert.equal(aliasFreeAi.configured, true);
});

