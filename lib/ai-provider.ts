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
  | "cheapllm"
  | "exaone"
  | "requesty"
  | "zro"
  | "aihubmix"
  | "freeai"
  | "freeapiai"
  | "siliconflow"
  | "modelscope"
  | "orcarouter"
  | "openai"
  | "openai-compatible";

export interface ProviderPreset {
  id: KnownProviderId;
  label: string;
  defaultBaseURL: string;
  defaultPrimaryModel: string;
  defaultFallbackModel: string;
  envApiKeyNames: string[];
  defaultApiKey?: string;
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
  cheapllm: {
    id: "cheapllm",
    label: "cheapllm.shop",
    defaultBaseURL: "https://cheapllm.shop/v1",
    defaultPrimaryModel: "deepseek-v4.1-flash-1017",
    defaultFallbackModel: "deepseek-v4.1-flash-1017",
    envApiKeyNames: ["AI_API_KEY", "CHEAPLLM_API_KEY"],
    notes: "Free during beta; post-beta permanent free tier is 5,000 input + 1,000 output tokens/hour. Small operator (watch-and-see).",
  },
  exaone: {
    id: "exaone",
    label: "LG EXAONE",
    defaultBaseURL: "https://api.exaone.ai/v1",
    defaultPrimaryModel: "k-exaone_v2.5",
    defaultFallbackModel: "k-exaone_v2.5",
    envApiKeyNames: ["AI_API_KEY", "EXAONE_API_KEY"],
    notes: "Currently available free of charge since 2026-11-09 (no end date or numeric quota published); 750B/31B MoE, 524K context, Korean/English text-only.",
  },
  requesty: {
    id: "requesty",
    label: "Requesty",
    defaultBaseURL: "https://router.requesty.ai/v1",
    defaultPrimaryModel: "gemma-4-31b-it",
    defaultFallbackModel: "nemotron-3-ultra-550b-a55b",
    envApiKeyNames: ["AI_API_KEY", "REQUESTY_API_KEY"],
    notes: "200 free requests/day on free models without a card; free model list changes often—verify against official free models page.",
  },
  zro: {
    id: "zro",
    label: "Zro (MoonMath)",
    defaultBaseURL: "https://zro.moonmath.ai/v1",
    defaultPrimaryModel: "deepseek-v4.1-flash",
    defaultFallbackModel: "deepseek-v4.1-flash",
    envApiKeyNames: ["AI_API_KEY", "ZRO_API_KEY"],
    notes: "Free plan ($0/mo) for Flash models (daily usage on DeepSeek V4.1 Flash, resets every day), no card required; exact daily quota not published.",
  },
  aihubmix: {
    id: "aihubmix",
    label: "AIHubMix",
    defaultBaseURL: "https://aihubmix.com/v1",
    defaultPrimaryModel: "gpt-4.1-free",
    defaultFallbackModel: "gpt-4.1-free",
    envApiKeyNames: ["AI_API_KEY", "AIHUBMIX_API_KEY"],
    notes: "Aggregator with 27+ free models (IDs end with -free); no card required, no trial expiration, daily quota reset.",
  },
  freeai: {
    id: "freeai",
    label: "Free.ai",
    defaultBaseURL: "https://api.free.ai/v1",
    defaultPrimaryModel: "qwen7b",
    defaultFallbackModel: "qwen7b",
    envApiKeyNames: ["AI_API_KEY", "FREEAI_API_KEY"],
    notes: "Self-hosted free pool (30,000 tokens/day, 1,000 req/month free tier, 60 RPM, no card required; key format sk-free-...). Connected via standard OpenAI-compatible /v1/chat/completions; /v1/chat/ vs /v1/chat/completions compatibility pending user live-key test.",
  },
  freeapiai: {
    id: "freeapiai",
    label: "FreeAPIAI",
    defaultBaseURL: "https://api.freeapiai.com/v1",
    defaultPrimaryModel: "free-ai",
    defaultFallbackModel: "free-ai",
    envApiKeyNames: ["AI_API_KEY", "FREEAPIAI_API_KEY"],
    defaultApiKey: "free",
    // Official site states: no moderation layer, no SLA, no uptime guarantee, and requests keep technical records (time, IP, User-Agent, country, endpoint, status, usage).
    notes: "No key, no registration, no paid tier (1 req/s burst 3, 2 concurrent, 10k req/day or 10M tokens/day per IP, UTC 00:00 reset; 32K ctx, 16K max reply). No moderation layer, no SLA/uptime guarantee; keeps technical request logs (time, IP, UA, country, endpoint, status, usage).",
  },
  siliconflow: {
    id: "siliconflow",
    label: "SiliconFlow",
    defaultBaseURL: "https://api.siliconflow.cn/v1",
    defaultPrimaryModel: "Qwen/Qwen3-8B",
    defaultFallbackModel: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
    envApiKeyNames: ["AI_API_KEY", "SILICONFLOW_API_KEY"],
    notes: "Free models cost 0 (chat RPM 1,000-10,000, TPM 50,000-5,000,000). Real-name verification required (mainland China ID / HK-Macau-Taiwan permit + Alipay facial recognition); available only in mainland China, HK, Macau, and Taiwan.",
  },
  modelscope: {
    id: "modelscope",
    label: "ModelScope API-Inference",
    defaultBaseURL: "https://api-inference.modelscope.cn/v1",
    defaultPrimaryModel: "Qwen/Qwen3.5-35B-A3B",
    defaultFallbackModel: "Qwen/Qwen3.5-35B-A3B",
    envApiKeyNames: ["AI_API_KEY", "MODELSCOPE_API_KEY"],
    notes: "Daily login 200 molis + Aliyun binding 50 molis/day (24h validity; ~0.5 light / ~1 standard / ~2 flagship per call). Must bind a real-name verified Aliyun account + verified email; official docs state no high-concurrency/SLA guarantee and non-commercial experience only. Model list rotates dynamically.",
  },
  orcarouter: {
    id: "orcarouter",
    label: "OrcaRouter",
    defaultBaseURL: "https://api.orcarouter.ai/v1",
    defaultPrimaryModel: "deepseek/deepseek-v4.1-flash-free",
    defaultFallbackModel: "deepseek/deepseek-v4-flash-free",
    envApiKeyNames: ["AI_API_KEY", "ORCAROUTER_API_KEY"],
    notes: "Free package (10 RPM / 50 RPD without top-up; 20 RPM / 800 RPD after $20 lifetime spend; 429 free_quota_exhausted on limit). Free model list rotates (check /api/free-package/public). Third-party reports note free models may require a GitHub account with history or any prior top-up (not stated on official site; pending user live-key test).",
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
  if (value === "cheapllm" || value === "cheapllm.shop") return "cheapllm";
  if (value === "exaone" || value === "lg-exaone") return "exaone";
  if (value === "requesty") return "requesty";
  if (value === "zro" || value === "moonmath") return "zro";
  if (value === "aihubmix") return "aihubmix";
  if (value === "freeai" || value === "free.ai" || value === "free-ai") return "freeai";
  if (value === "freeapiai") return "freeapiai";
  if (value === "siliconflow") return "siliconflow";
  if (value === "modelscope") return "modelscope";
  if (value === "orcarouter") return "orcarouter";
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
    .find(Boolean)
    || preset.defaultApiKey
    || "";

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
