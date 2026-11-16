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
  | "openai"
  | "openai-compatible";

export interface ProviderPreset {
  id: KnownProviderId;
  label: string;
  defaultBaseURL: string;
  defaultPrimaryModel: string;
  defaultFallbackModel: string;
  envApiKeyNames: string[];
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
  const fallbackRaw = env.AI_FALLBACK_MODEL?.trim()
    || (presetId === "deepseek" ? preset.defaultFallbackModel : primaryRaw);

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
