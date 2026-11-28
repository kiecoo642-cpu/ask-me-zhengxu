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
  | "bigmodel"
  | "sensenova"
  | "plugsky"
  | "vikasit"
  | "nararouter"
  | "anyapi"
  | "routmy"
  | "inferbase"
  | "kilo"
  | "typhoon"
  | "meganova"
  | "bazaarlink"
  | "dreamprompting"
  | "llm7"
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
    defaultPrimaryModel: "gpt-oss-120b",
    defaultFallbackModel: "gemma-4-31B-it",
    envApiKeyNames: ["AI_API_KEY", "SAMBANOVA_API_KEY"],
    notes: "Free tier has shrunk to only 2 models (gpt-oss-120b and gemma-4-31B-it); DeepSeek-V3.1 removed from free tier. Official rate-limit page confirms 20 RPM / 20 RPD / 200k TPD without linked card; verify with own key.",
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
  bigmodel: {
    id: "bigmodel",
    label: "智谱 BigModel",
    defaultBaseURL: "https://open.bigmodel.cn/api/paas/v4",
    defaultPrimaryModel: "glm-4.7-flash",
    defaultFallbackModel: "glm-4.6v-flash",
    envApiKeyNames: ["AI_API_KEY", "BIGMODEL_API_KEY"],
    notes: "glm-4.7-flash (200K ctx, free input/output/cache, no time-limit wording), glm-4.6v-flash (vision, 200K, free input/output), & glm-z1-flash (128K, free input/output per official detailed pricing table; 6 free models total on detailed pricing table vs 2 in main FAQ). New users receive a 20M-token resource pack (validity not stated on official site—do not assume permanent); free concurrency/rate limits not published. Note: GLM-4-Flash is listed only as dated GLM-4-Flash-250414; BigModel (China domestic) is distinct from Z.ai (international).",
  },
  sensenova: {
    id: "sensenova",
    label: "商汤 SenseNova Token Plan",
    defaultBaseURL: "https://token.sensenova.cn/v1",
    defaultPrimaryModel: "sensenova-6.8-flash-lite",
    defaultFallbackModel: "sensenova-6.8-flash-lite",
    envApiKeyNames: ["AI_API_KEY", "SENSENOVA_API_KEY"],
    notes: "Free tier (¥0/month, public beta limited-time quota, rules subject to adjustment; paid tier not yet launched). Token Plan page confirms only 6.8 Flash Lite & U1 Fast (U1 omitted as fallback due to naming discrepancy U1.5 Lite/Fast vs U1 Fast); DeepSeek V4.1 Flash / GLM-5.3 / Kimi K3 in model overview are not listed as free-tier (pending live test). Pools: general 120k/5h & 1.2M/week; Flash-Lite 60k/5h & 600k/week. Phone verification required; up to 20 API keys.",
  },
  plugsky: {
    id: "plugsky",
    label: "Plugsky",
    defaultBaseURL: "https://api.plugsky.com/v1",
    defaultPrimaryModel: "plugsky-lite",
    defaultFallbackModel: "plugsky-micro",
    envApiKeyNames: ["AI_API_KEY", "PLUGSKY_API_KEY"],
    notes: "100% OpenAI-compatible (official site). Free tier includes only 2 first-party models (plugsky-lite, plugsky-micro): 100 req/day + 50,000 tokens/day for new accounts (~21 req / 10,400 tokens per 5h rolling window), 1 concurrent, 30 RPM, 2K max output tokens/req, no card required; first-party small models with unverified capability.",
  },
  vikasit: {
    id: "vikasit",
    label: "Vikasit AI",
    defaultBaseURL: "https://api.vikasit.ai/v1",
    defaultPrimaryModel: "vikasit-nova",
    defaultFallbackModel: "vikasit-nova",
    envApiKeyNames: ["AI_API_KEY", "VIKASIT_API_KEY"],
    notes: "OpenAI-compatible (chat/streaming/tool calls supported). Free tier includes only 1 first-party model (vikasit-nova): 2,000,000 free tokens/day, GitHub login for key, no card required; official site notes free quota may be adjusted; first-party model capability unverified.",
  },
  nararouter: {
    id: "nararouter",
    label: "NaraRouter",
    defaultBaseURL: "https://router.bynara.id/v1",
    defaultPrimaryModel: "agnes-2.5-flash",
    defaultFallbackModel: "agnes-2.5-flash",
    envApiKeyNames: ["AI_API_KEY", "NARAROUTER_API_KEY"],
    notes: "OpenAI-compatible (also supports Anthropic /v1/messages). Free tier has 7,000,000 tokens/day, 15 RPM, resets 07:00 WIB (00:00 UTC) daily, no card required, Google login for key; free list shrank from 3 models (2026-08 third-party test) to only agnes-2.5-flash (2026-11-25 official site; other 47+ catalog models are pay-as-you-go). First-party model capability unverified.",
  },
  anyapi: {
    id: "anyapi",
    label: "AnyAPI",
    defaultBaseURL: "https://api.anyapi.ai/v1",
    defaultPrimaryModel: "inclusionai/ling-3.0-flash-fin:free",
    defaultFallbackModel: "qwen/qwen3.8-27b:free",
    envApiKeyNames: ["AI_API_KEY", "ANYAPI_API_KEY"],
    notes: "Free $0/month, 100,000 AnyTokens per day (platform-internal billing unit, 1 is about 1,000 tokens for most models), no card required; alternative models: qwen/qwen3.8-27b:free, google/gemma-3n-4b:free; the full free-model list is only visible in the catalog after login; free-tier API calls are rate-limited, exact RPM is not published on the official site.",
  },
  routmy: {
    id: "routmy",
    label: "rout.my",
    defaultBaseURL: "https://api.rout.my/v1",
    defaultPrimaryModel: "deepseek/deepseek-v4.1-flash-1017@free",
    defaultFallbackModel: "z-ai/glm-5.3-flash@free",
    envApiKeyNames: ["AI_API_KEY", "ROUTMY_API_KEY"],
    notes: "Free plan $0 (get the key via Discord login), 650,000 tokens per day; @free routes do not consume quota and remain usable after quota is exhausted; the free-route list may change; keep the @free route suffix in model IDs exactly as given — do NOT \"fix\" it into a model ID without the suffix.",
  },
  inferbase: {
    id: "inferbase",
    label: "Inferbase",
    defaultBaseURL: "https://api.inferbase.ai/v1",
    defaultPrimaryModel: "auto",
    defaultFallbackModel: "auto",
    envApiKeyNames: ["AI_API_KEY", "INFERBASE_API_KEY"],
    notes: "Free plan 5,000 requests/month; free hosted inference 100/day, 10/min, $0.50/day usage; per-request input <=8,192 tokens, output <=1,024 tokens; model output price <=$2.00/1M; over-limit returns 402.",
  },
  kilo: {
    id: "kilo",
    label: "Kilo Gateway",
    defaultBaseURL: "https://api.kilo.ai/api/gateway",
    defaultPrimaryModel: "kilo-auto/free",
    defaultFallbackModel: "nvidia/nemotron-3-ultra-550b-a55b:free",
    envApiKeyNames: ["AI_API_KEY", "KILO_API_KEY"],
    defaultApiKey: "anonymous",
    notes: "Optional KILO_API_KEY (anonymous use without a key is possible): anonymous 200 requests/hour per IP (free models only); free list rotates; upstream may log requests and use them to improve the service, so do not send sensitive content.",
  },
  typhoon: {
    id: "typhoon",
    label: "Typhoon (OpenTyphoon)",
    defaultBaseURL: "https://api.opentyphoon.ai/v1",
    defaultPrimaryModel: "typhoon-v2.5-30b-a3b-instruct",
    defaultFallbackModel: "typhoon-v2.1-12b-instruct",
    envApiKeyNames: ["AI_API_KEY", "TYPHOON_API_KEY"],
    notes: "Official FAQ says research showcase, free to use; Thai-language specialist, beta, no formal support, no numeric rate limit; general Q&A ability unverified.",
  },
  meganova: {
    id: "meganova",
    label: "MegaNova AI",
    defaultBaseURL: "https://api.meganova.ai/v1",
    defaultPrimaryModel: "mistralai/Mistral-Small-3.2-24B-Instruct-2506",
    defaultFallbackModel: "meganova-ai/manta-mini-1.0",
    envApiKeyNames: ["AI_API_KEY", "MEGANOVA_API_KEY"],
    notes: "Tier 1 is 50 requests/day per model, 60 RPM, 200,000 TPM; most free models are role-play fine-tunes, terms say for evaluation/interactive use only and grant a broad license over submitted content; the only general chat model is Mistral Small 3.2.",
  },
  bazaarlink: {
    id: "bazaarlink",
    label: "BazaarLink",
    defaultBaseURL: "https://api.bazaarlink.ai/v1",
    defaultPrimaryModel: "qwen/qwen3.7-flash",
    defaultFallbackModel: "deepseek/deepseek-v4-flash-0731free",
    envApiKeyNames: ["AI_API_KEY", "BAZAARLINK_API_KEY"],
    notes: "No card required; without a card 10 RPM / 60 weighted units per day (with credit 20 RPM / 120 units), 2 concurrent, resets daily at 00:00 UTC; free list rotates (plus an auto:free route); long inputs consume more weighted units.",
  },
  dreamprompting: {
    id: "dreamprompting",
    label: "DreamPrompting",
    defaultBaseURL: "https://dreamprompting.com/api/v1",
    defaultPrimaryModel: "auto",
    defaultFallbackModel: "auto",
    envApiKeyNames: ["AI_API_KEY", "DREAMPROMPTING_API_KEY"],
    notes: "No card required; 100 RPM per IP, per account rolling 24h 5,000 requests + 500,000 tokens; gateway auto-selects upstream with failover and aggregates upstream free tiers, availability varies with the upstream pool.",
  },
  llm7: {
    id: "llm7",
    label: "LLM7.io",
    defaultBaseURL: "https://api.llm7.io/v1",
    defaultPrimaryModel: "gpt-oss:20b",
    defaultFallbackModel: "codestral-latest",
    envApiKeyNames: ["AI_API_KEY", "LLM7_API_KEY"],
    defaultApiKey: "unused",
    notes: "Optional LLM7_API_KEY (anonymous use without a key is possible, Authorization may be set to unused): only turbo-tier models are free; the site no longer publishes free-quota numbers, and the free tier may stop at any time without notice.",
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
  if (value === "bigmodel") return "bigmodel";
  if (value === "sensenova") return "sensenova";
  if (value === "plugsky") return "plugsky";
  if (value === "vikasit" || value === "vikasit-ai" || value === "vikasitai") return "vikasit";
  if (value === "nararouter" || value === "nara-router") return "nararouter";
  if (value === "anyapi") return "anyapi";
  if (value === "routmy" || value === "rout.my") return "routmy";
  if (value === "inferbase") return "inferbase";
  if (value === "kilo" || value === "kilogateway" || value === "kilo-gateway") return "kilo";
  if (value === "typhoon" || value === "opentyphoon") return "typhoon";
  if (value === "meganova" || value === "meganova-ai") return "meganova";
  if (value === "bazaarlink") return "bazaarlink";
  if (value === "dreamprompting") return "dreamprompting";
  if (value === "llm7" || value === "llm7.io") return "llm7";
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
