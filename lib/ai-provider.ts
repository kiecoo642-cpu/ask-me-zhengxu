import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

export type KnownProviderId =
  | "deepseek"
  | "gemini"
  | "openrouter"
  | "groq"
  | "together"
  | "nvidia"
  | "zai"
  | "sambanova"
  | "amd"
  | "novita"
  | "merkium"
  | "hetzner"
  | "unorouter"
  | "llmkiwi"
  | "maritaca"
  | "cheapllm"
  | "openai"
  | "openai-compatible";

export interface ProviderPreset {
  id: KnownProviderId;
  label: string;
  defaultBaseURL: string;
  defaultPrimaryModel: string;
  defaultFallbackModel: string;
  envApiKeyNames: string[];
  notes?: string;
}

export const PROVIDER_PRESETS: Record<KnownProviderId, ProviderPreset> = {
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    defaultBaseURL: "https://api.deepseek.com",
    defaultPrimaryModel: "deepseek-v4-flash",
    defaultFallbackModel: "deepseek-v4-pro",
    envApiKeyNames: ["AI_API_KEY", "DEEPSEEK_API_KEY"],
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini (OpenAI-compatible)",
    defaultBaseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    defaultPrimaryModel: "gemini-4-hydrogen",
    defaultFallbackModel: "gemini-4-hydrogen",
    envApiKeyNames: ["AI_API_KEY", "GEMINI_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY"],
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    defaultBaseURL: "https://openrouter.ai/api/v1",
    defaultPrimaryModel: "openrouter/free",
    defaultFallbackModel: "openrouter/free",
    envApiKeyNames: ["AI_API_KEY", "OPENROUTER_API_KEY"],
  },
  groq: {
    id: "groq",
    label: "Groq",
    defaultBaseURL: "https://api.groq.com/openai/v1",
    defaultPrimaryModel: "openai/gpt-oss-120b",
    defaultFallbackModel: "openai/gpt-oss-120b",
    envApiKeyNames: ["AI_API_KEY", "GROQ_API_KEY"],
  },
  together: {
    id: "together",
    label: "Together AI",
    defaultBaseURL: "https://api.together.xyz/v1",
    defaultPrimaryModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    defaultFallbackModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    envApiKeyNames: ["AI_API_KEY", "TOGETHER_API_KEY"],
  },
  nvidia: {
    id: "nvidia",
    label: "NVIDIA NIM",
    defaultBaseURL: "https://integrate.api.nvidia.com/v1",
    defaultPrimaryModel: "nvidia/nemotron-3",
    defaultFallbackModel: "nvidia/nemotron-3",
    envApiKeyNames: ["AI_API_KEY", "NVIDIA_API_KEY"],
  },
  zai: {
    id: "zai",
    label: "Z.ai GLM",
    defaultBaseURL: "https://api.z.ai/api/paas/v4/",
    defaultPrimaryModel: "glm-4.7-flash",
    defaultFallbackModel: "glm-4.7-flash",
    envApiKeyNames: ["AI_API_KEY", "ZAI_API_KEY"],
  },
  sambanova: {
    id: "sambanova",
    label: "SambaNova Cloud",
    defaultBaseURL: "https://api.sambanova.ai/v1",
    defaultPrimaryModel: "DeepSeek-V3.1",
    defaultFallbackModel: "gpt-oss-120b",
    envApiKeyNames: ["AI_API_KEY", "SAMBANOVA_API_KEY"],
    notes: "Official rate-limit page (2026-11-04) confirms free tier restored (20 RPM / 20 RPD / 200k TPD without linked card); Aug 2026 live test returned 402, so user must verify with own key.",
  },
  amd: {
    id: "amd",
    label: "AMD Token Factory",
    defaultBaseURL: "https://developer.amd.com.cn/radeon/api/v1",
    defaultPrimaryModel: "DeepSeek-V4-Flash",
    defaultFallbackModel: "DeepSeek-V4.1-Flash",
    envApiKeyNames: ["AI_API_KEY", "RADEON_API_KEY"],
    notes: "China site only, free daily pts cap (resets 00:00 Beijing time); trial/dev only (not for production). Model list changes often; verify via GET /v1/models.",
  },
  novita: {
    id: "novita",
    label: "Novita AI",
    defaultBaseURL: "https://api.novita.ai/openai",
    defaultPrimaryModel: "apodex/apodex-1.1-mini",
    defaultFallbackModel: "apodex/apodex-1.1-mini",
    envApiKeyNames: ["AI_API_KEY", "NOVITA_API_KEY"],
    notes: "Apodex 1.1 Mini input/output $0 (256K context); all other models are paid. Public pages do not state whether zero-price models require an account balance.",
  },
  merkium: {
    id: "merkium",
    label: "Merkium",
    defaultBaseURL: "https://chat.merkium.nl/api/v1",
    defaultPrimaryModel: "ganymede-1.1",
    defaultFallbackModel: "pluto-1.2-pro",
    envApiKeyNames: ["AI_API_KEY", "MERKIUM_API_KEY"],
    notes: "7 models permanently free, 30 RPM/key, no card required.",
  },
  hetzner: {
    id: "hetzner",
    label: "Hetzner Inference API",
    defaultBaseURL: "https://inference.hetzner.com/api/v1",
    defaultPrimaryModel: "Qwen/Qwen3.6-35B-A3B-FP8",
    defaultFallbackModel: "Qwen3.8-27B",
    envApiKeyNames: ["AI_API_KEY", "HETZNER_API_KEY"],
    notes: "Free during experimental period (changes notified by email in advance); 10 requests per 60 seconds.",
  },
  unorouter: {
    id: "unorouter",
    label: "UnoRouter",
    defaultBaseURL: "https://api.unorouter.com/v1",
    defaultPrimaryModel: "gemini-3.8-flash:free",
    defaultFallbackModel: "gemini-3.8-flash:free",
    envApiKeyNames: ["AI_API_KEY", "UNOROUTER_API_KEY"],
    notes: "Aggregator with 150+ :free models (~1 req/min per model per account). Model list changes often and some upstream providers may retain prompts.",
  },
  llmkiwi: {
    id: "llmkiwi",
    label: "LLM.kiwi",
    defaultBaseURL: "https://api.llm.kiwi/v1",
    defaultPrimaryModel: "auto",
    defaultFallbackModel: "auto",
    envApiKeyNames: ["AI_API_KEY", "LLM_KIWI_API_KEY"],
    notes: "Free with no card required; automatic routing with undisclosed backend models.",
  },
  maritaca: {
    id: "maritaca",
    label: "Maritaca AI",
    defaultBaseURL: "https://chat.maritaca.ai/api",
    defaultPrimaryModel: "S5-free",
    defaultFallbackModel: "S5-free",
    envApiKeyNames: ["AI_API_KEY", "MARITACA_API_KEY"],
    notes: "S5-free is free for a limited time, text-only, unbilled tokens, and may be taken offline at any time.",
  },
  cheapllm: {
    id: "cheapllm",
    label: "cheapllm.shop",
    defaultBaseURL: "https://cheapllm.shop/v1",
    defaultPrimaryModel: "deepseek-v4.1-flash-1017",
    defaultFallbackModel: "deepseek-v4.1-flash-1017",
    envApiKeyNames: ["AI_API_KEY", "CHEAPLLM_API_KEY"],
    notes: "Free during beta; post-beta permanent free tier is 5,000 input + 1,000 output tokens/hour. Small operator (watch-and-see).",
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    defaultBaseURL: "https://api.openai.com/v1",
    defaultPrimaryModel: "gpt-4o-mini",
    defaultFallbackModel: "gpt-4o-mini",
    envApiKeyNames: ["AI_API_KEY", "OPENAI_API_KEY"],
  },
  "openai-compatible": {
    id: "openai-compatible",
    label: "Generic OpenAI-Compatible",
    defaultBaseURL: "",
    defaultPrimaryModel: "gpt-4o-mini",
    defaultFallbackModel: "gpt-4o-mini",
    envApiKeyNames: ["AI_API_KEY", "OPENAI_API_KEY", "DEEPSEEK_API_KEY"],
  },
};

export interface ResolvedProviderConfig {
  provider: string;
  presetId: KnownProviderId;
  baseURL: string;
  apiKey: string;
  primaryModel: string;
  fallbackModel: string;
  configured: boolean;
}

function normalizeProviderId(raw?: string): KnownProviderId {
  const value = raw?.trim().toLowerCase();
  if (!value || value === "deepseek") return "deepseek";
  if (value === "gemini" || value === "google") return "gemini";
  if (value === "openrouter") return "openrouter";
  if (value === "groq") return "groq";
  if (value === "together" || value === "togetherai") return "together";
  if (value === "nvidia" || value === "nim" || value === "nvidia-nim") return "nvidia";
  if (value === "zai" || value === "z.ai" || value === "zhipu" || value === "glm") return "zai";
  if (value === "sambanova") return "sambanova";
  if (value === "amd" || value === "radeon" || value === "amd-token-factory") return "amd";
  if (value === "novita") return "novita";
  if (value === "merkium") return "merkium";
  if (value === "hetzner") return "hetzner";
  if (value === "unorouter") return "unorouter";
  if (value === "llmkiwi" || value === "llm.kiwi") return "llmkiwi";
  if (value === "maritaca") return "maritaca";
  if (value === "cheapllm" || value === "cheapllm.shop") return "cheapllm";
  if (value === "openai") return "openai";
  return "openai-compatible";
}

function normalizeModelId(provider: KnownProviderId, modelId: string) {
  return provider === "deepseek" ? modelId.replace(/^deepseek\//, "") : modelId;
}

export function resolveProviderConfig(env: NodeJS.ProcessEnv = process.env): ResolvedProviderConfig {
  const rawProvider = env.AI_PROVIDER?.trim().toLowerCase() || "deepseek";
  const presetId = normalizeProviderId(rawProvider);
  const preset = PROVIDER_PRESETS[presetId];

  const baseURL = env.AI_BASE_URL?.trim()
    || (presetId === "deepseek" ? env.DEEPSEEK_BASE_URL?.trim() : "")
    || preset.defaultBaseURL;

  const apiKey = preset.envApiKeyNames
    .map((name) => env[name]?.trim() ?? "")
    .find(Boolean) ?? "";

  const primaryRaw = env.AI_MODEL?.trim()
    || env.AI_PRIMARY_MODEL?.trim()
    || preset.defaultPrimaryModel;
  const hasCustomPrimary = Boolean(env.AI_MODEL?.trim() || env.AI_PRIMARY_MODEL?.trim());
  const fallbackRaw = env.AI_FALLBACK_MODEL?.trim()
    || (hasCustomPrimary && presetId !== "deepseek" ? primaryRaw : preset.defaultFallbackModel);

  return {
    provider: rawProvider,
    presetId,
    baseURL,
    apiKey,
    primaryModel: normalizeModelId(presetId, primaryRaw),
    fallbackModel: normalizeModelId(presetId, fallbackRaw),
    configured: Boolean(apiKey && baseURL),
  };
}

export function isModelConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return resolveProviderConfig(env).configured;
}

export function createLanguageModel(modelId: string, config = resolveProviderConfig()): LanguageModel {
  if (config.presetId === "deepseek") {
    const deepSeek = createDeepSeek({
      baseURL: config.baseURL || PROVIDER_PRESETS.deepseek.defaultBaseURL,
      ...(config.apiKey ? { apiKey: config.apiKey } : {}),
    });
    return deepSeek(modelId) as unknown as LanguageModel;
  }

  const client = createOpenAICompatible({
    name: config.provider || config.presetId,
    baseURL: config.baseURL,
    apiKey: config.apiKey,
  });
  return client.chatModel(modelId) as unknown as LanguageModel;
}
