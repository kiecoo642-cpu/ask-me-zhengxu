# Ask Me — 郑栩版（AI Career Digital Twin）

郑栩的 AI Career Agent（AI 职业数字分身），面向 AI 产品招聘经理和业务面试官。项目基于 MIT 许可复用 `ZackZhang-AI/ask-me-career-agent` 的代码框架、检索与评测方法，**内容已 100% 替换为郑栩简历 v4 的真实经历与数据**。

## 核心能力

- **首页摘要与可核验项目**：集中展示郑栩的教育背景（东华大学 211 信息管理与信息系统、GPA 3.3/4.0 专业前 10%）、可到岗时间（每周 5 天、连续 6 个月、1 周内到岗），以及 aTalent IHG AI 人才匹配、电商多步决策 Agent 评测沙箱、中文帮助文档 RAG 评测、Claude Jira 提效工具等可点击验证的项目。
- **关键词召回 + Claim-Source 证据模型**：所有回答仅使用 `content/` 中已审核的公开知识（`knowledge.ts`、`qa.ts`、`stories.ts`、`sources-claims.ts`、`narrative.ts`、`agent-profile.ts`、`interview-persona.ts`），每条关键陈述均映射到可追溯的 Claim 与 Source。
- **严格事实与隐私边界**：
  - IHG 85% 业务采纳率严格按简历 v4 口径表述，并显式标注**分母口径待澄清**，不自行补造。
  - 超纲问题、隐私探针（手机号/邮箱/住址）、未公开企业机密或要求编造经历的请求一律拒答或澄清。
  - 不宣称“测试通过等于提升招聘转化率”。
- **简历占位入口**：`/resume` 默认生成并返回一个明确标注 `PLACEHOLDER / 待替换` 的单页 PDF（不含手机号与私人邮箱）；配置 `RESUME_BLOB_URL` 后可切换为 Vercel Blob 托管的正式简历。

## 本地运行

需要 Node.js 20.9 或更高版本。

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认本地访问地址：`http://localhost:3000`（或通过 `npm run build` 导出静态站点到 `out/` 目录，用于 GitHub Pages 部署）。

> **静态导出与本地 Mock 模式（GitHub Pages）**：`next.config.ts` 已配置 `output: "export"`，静态部署站点（`https://kiecoo642-cpu.github.io/ask-me-zhengxu/`）完全在浏览器端运行关键词召回 + Claim-Source 本地 Mock 问答（不依赖 `/api/chat` 服务端路由），`/resume` 提供静态占位简历页与 `zhengxu-resume-placeholder.pdf` 下载入口。如需连接 DeepSeek / Gemini / OpenRouter / Groq / Together 等线上模型，可使用 `server/api/chat/route.ts` 配合服务端环境变量运行（禁止将任何 API Key 写入代码或仓库）。

## 环境变量（完整列表见 `.env.example`）

| 变量名 | 用途 | 必填 |
| --- | --- | --- |
| `AI_PROVIDER` | 模型 Provider 标识（默认 `deepseek`，可选 `gemini` / `openrouter` / `groq` / `together` / `nvidia` / `zai` / `sambanova` / `amd` / `novita` / `merkium` / `hetzner` / `unorouter` / `llmkiwi` / `cheapllm` / `exaone` / `requesty` / `zro` / `aihubmix` / `freeai` / `freeapiai` / `siliconflow` / `modelscope` / `orcarouter` / `bigmodel` / `sensenova` / `openai` / `openai-compatible`） | 可选 |
| `AI_BASE_URL` | 自定义 OpenAI-compatible 接口地址（未设置时按 `AI_PROVIDER` 使用预设地址） | 可选 |
| `AI_API_KEY` | 通用模型 API 服务端密钥（优先读取；未设置时按 Provider 自动回退到 `DEEPSEEK_API_KEY` / `GEMINI_API_KEY` 等，禁止 `NEXT_PUBLIC_`） | 可选（启用模型问答时必填） |
| `AI_MODEL` | 主生成模型名称（未设置时按 `AI_PROVIDER` 使用默认模型） | 可选 |
| `DEEPSEEK_API_KEY` | DeepSeek 官方 API 服务端密钥（默认 Provider 兼容变量） | 可选 |
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址（默认 `https://api.deepseek.com`） | 可选 |
| `AI_PRIMARY_MODEL` | 主生成与规划模型（DeepSeek 默认 `deepseek-v4-flash`） | 可选 |
| `AI_FALLBACK_MODEL` | 回退与审校模型（DeepSeek 默认 `deepseek-v4-pro`） | 可选 |
| `CHAT_DISABLED` | 紧急关闭模型问答开关（`true`/`false`） | 可选 |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Upstash Redis 跨实例限流（未配置时使用内存限流） | 可选 |
| `PRIVACY_HASH_SALT` | IP 与会话匿名哈希盐值 | 可选 |
| `RATE_LIMIT_PER_MINUTE` | 单 IP 每分钟请求上限（默认 `5`） | 可选 |
| `SESSION_QUESTION_LIMIT` | 单会话提问上限（默认 `20`） | 可选 |
| `DAILY_REQUEST_LIMIT` | 每日模型请求预算（默认 `200`） | 可选 |
| `DAILY_TOKEN_LIMIT` | 每日 Token 预算（默认 `300000`） | 可选 |
| `TOKEN_RESERVATION` | 单次请求预留 Token（默认 `1500`） | 可选 |
| `DATABASE_URL` | Neon Postgres 匿名质量埋点连接串 | 可选 |
| `CRON_SECRET` | 定时任务鉴权密钥 | 可选 |
| `RESUME_READ_WRITE_TOKEN` / `RESUME_STORE_ID` | Vercel Blob 读写凭证 | 可选 |
| `RESUME_BLOB_URL` | 正式简历 PDF 外部地址（未配置时 `/resume` 返回占位 PDF） | 可选 |
| `OBSIDIAN_VAULT_PATH` / `OBSIDIAN_SYNC_OUTPUT` | 仅本地 Obsidian 只读同步脚本使用 | 可选 |

### 多 Provider 配置示例（仅展示环境变量名，切勿提交真实密钥）

- **Google Gemini（OpenAI-compatible）**：`AI_PROVIDER=gemini`、`AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/`、`GEMINI_API_KEY=<your-key>`、`AI_MODEL=gemini-4-hydrogen`
- **OpenRouter**：`AI_PROVIDER=openrouter`、`AI_BASE_URL=https://openrouter.ai/api/v1`、`OPENROUTER_API_KEY=<your-key>`、`AI_MODEL=openrouter/free`
- **Groq**：`AI_PROVIDER=groq`、`AI_BASE_URL=https://api.groq.com/openai/v1`、`GROQ_API_KEY=<your-key>`、`AI_MODEL=openai/gpt-oss-120b`
- **Together AI**：`AI_PROVIDER=together`、`AI_BASE_URL=https://api.together.xyz/v1`、`TOGETHER_API_KEY=<your-key>`、`AI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo`
- **NVIDIA NIM（需用户提供 `nvapi-` 密钥）**：`AI_PROVIDER=nvidia`、`AI_BASE_URL=https://integrate.api.nvidia.com/v1`、`NVIDIA_API_KEY=<your-key>`、`AI_MODEL=nvidia/nemotron-3`
- **Z.ai GLM（免费 Flash 系列，需用户提供密钥）**：`AI_PROVIDER=zai`、`AI_BASE_URL=https://api.z.ai/api/paas/v4/`、`ZAI_API_KEY=<your-key>`、`AI_MODEL=glm-4.7-flash`
- **SambaNova Cloud**：`AI_PROVIDER=sambanova`、`AI_BASE_URL=https://api.sambanova.ai/v1`、`SAMBANOVA_API_KEY=<your-key>`、`AI_MODEL=DeepSeek-V3.1`（备选 `gpt-oss-120b`）
- **AMD Token Factory（仅中国站，试用/开发用）**：`AI_PROVIDER=amd`、`AI_BASE_URL=https://developer.amd.com.cn/radeon/api/v1`、`RADEON_API_KEY=<your-key>`、`AI_MODEL=DeepSeek-V4-Flash`
- **Novita AI**：`AI_PROVIDER=novita`、`AI_BASE_URL=https://api.novita.ai/openai`、`NOVITA_API_KEY=<your-key>`、`AI_MODEL=apodex/apodex-1.1-mini`
- **Merkium**：`AI_PROVIDER=merkium`、`AI_BASE_URL=https://chat.merkium.nl/api/v1`、`MERKIUM_API_KEY=<your-key>`、`AI_MODEL=ganymede-1.1`（备选 `pluto-1.2-pro`）
- **Hetzner Inference API**：`AI_PROVIDER=hetzner`、`AI_BASE_URL=https://inference.hetzner.com/api/v1`、`HETZNER_API_KEY=<your-key>`、`AI_MODEL=Qwen/Qwen3.6-35B-A3B-FP8`（备选 `Qwen3.8-27B`）
- **UnoRouter**：`AI_PROVIDER=unorouter`、`AI_BASE_URL=https://api.unorouter.com/v1`、`UNOROUTER_API_KEY=<your-key>`、`AI_MODEL=gemini-3.8-flash:free`
- **LLM.kiwi**：`AI_PROVIDER=llmkiwi`、`AI_BASE_URL=https://api.llm.kiwi/v1`、`LLM_KIWI_API_KEY=<your-key>`、`AI_MODEL=auto`
- **cheapllm.shop**：`AI_PROVIDER=cheapllm`、`AI_BASE_URL=https://cheapllm.shop/v1`、`CHEAPLLM_API_KEY=<your-key>`、`AI_MODEL=deepseek-v4.1-flash-1017`
- **LG EXAONE**：`AI_PROVIDER=exaone`、`AI_BASE_URL=https://api.exaone.ai/v1`、`EXAONE_API_KEY=<your-key>`、`AI_MODEL=k-exaone_v2.5`
- **Requesty**：`AI_PROVIDER=requesty`、`AI_BASE_URL=https://router.requesty.ai/v1`、`REQUESTY_API_KEY=<your-key>`、`AI_MODEL=gemma-4-31b-it`（备选 `nemotron-3-ultra-550b-a55b`）
- **Zro (MoonMath)**：`AI_PROVIDER=zro`、`AI_BASE_URL=https://zro.moonmath.ai/v1`、`ZRO_API_KEY=<your-key>`、`AI_MODEL=deepseek-v4.1-flash`
- **AIHubMix**：`AI_PROVIDER=aihubmix`、`AI_BASE_URL=https://aihubmix.com/v1`、`AIHUBMIX_API_KEY=<your-key>`、`AI_MODEL=gpt-4.1-free`
- **Free.ai**：`AI_PROVIDER=freeai`、`AI_BASE_URL=https://api.free.ai/v1`、`FREEAI_API_KEY=<your-key>`、`AI_MODEL=qwen7b`（标准 OpenAI-compatible 接入，`/v1/chat/completions` 兼容性待实测）
- **FreeAPIAI（免密钥、免注册）**：`AI_PROVIDER=freeapiai`、`AI_BASE_URL=https://api.freeapiai.com/v1`、`AI_MODEL=free-ai`（无需注册或真实密钥，`FREEAPIAI_API_KEY` 留空时默认使用占位符 `"free"`；每 IP 1 req/s、突发 3、并发 2、每日 10,000 次或 10,000,000 tokens，UTC 00:00 重置，32K 上下文 / 单次回复上限 16K tokens，超限返回 429。**注意**：官方明确说明该模型无审核层、无 SLA 或在线率保证，且请求会保留技术记录（时间、IP、User-Agent、国家、端点、状态、用量））
- **SiliconFlow**：`AI_PROVIDER=siliconflow`、`AI_BASE_URL=https://api.siliconflow.cn/v1`、`SILICONFLOW_API_KEY=<your-key>`、`AI_MODEL=Qwen/Qwen3-8B`（备选 `deepseek-ai/DeepSeek-R1-0528-Qwen3-8B`；定价页标注 `free` 的对话模型成本为 0，官方仅公布按类别范围 Chat RPM 1,000-10,000 / TPM 50,000-5,000,000。**注意**：官方文档要求必须完成实名认证（中国大陆身份证 / 港澳台居住证或通行证 + 支付宝人脸识别）方可使用所有免费模型，且仅限中国大陆及港澳台地区使用）
- **ModelScope 魔搭 API-Inference**：`AI_PROVIDER=modelscope`、`AI_BASE_URL=https://api-inference.modelscope.cn/v1`、`MODELSCOPE_API_KEY=<your-ms-token>`、`AI_MODEL=Qwen/Qwen3.5-35B-A3B`（每日登录 200 魔粒 + 绑定阿里云 50 魔粒/天，24 小时有效；单次调用轻量 ~0.5 / 标准 ~1 / 旗舰 ~2 魔粒；模型清单随社区热度动态变化。**注意**：须绑定实名认证的阿里云账号并验证邮箱方可使用 API-Inference；官网明确免费服务无高并发或 SLA 保障、仅限非商业体验）
- **OrcaRouter**：`AI_PROVIDER=orcarouter`、`AI_BASE_URL=https://api.orcarouter.ai/v1`、`ORCAROUTER_API_KEY=<your-sk-orca-key>`、`AI_MODEL=deepseek/deepseek-v4.1-flash-free`（备选 `deepseek/deepseek-v4-flash-free`；未充值 10 RPM / 50 RPD，生涯累计付费 \$20 后 20 RPM / 800 RPD，超限返回 `429 free_quota_exhausted`。**注意**：免费包清单轮换，以官方 `/api/free-package/public` 为准；第三方称免费模型可能须绑定有历史的 GitHub 账号或任意付费后才可用，官网未写明，待用户拿 key 实测）
- **智谱 BigModel（国内版）**：`AI_PROVIDER=bigmodel`、`AI_BASE_URL=https://open.bigmodel.cn/api/paas/v4`、`BIGMODEL_API_KEY=<your-key>`、`AI_MODEL=glm-4.7-flash`（200K 上下文，输入/输出/缓存均免费、无限时限定词；备选视觉模型 `glm-4.6v-flash`，200K、输入/输出免费。**注意**：新用户另赠 2000 万 Tokens 资源包但官网未写明有效期（非永久有效）；免费模型并发/限速数字官网未公布；`GLM-4-Flash` 仅以 `GLM-4-Flash-250414` 见于定价表；BigModel 国内版与 Z.ai 国际版为不同平台，请勿混淆）
- **商汤 SenseNova Token Plan**：`AI_PROVIDER=sensenova`、`AI_BASE_URL=https://token.sensenova.cn/v1`、`SENSENOVA_API_KEY=<your-key>`、`AI_MODEL=sensenova-6.8-flash-lite`（免费档 ¥0/月，公测期“限时放量”、额度规则可调整、付费档尚未上线；额度：通用积分池滚动 5 小时 120,000 / 滚动周 1,200,000，Flash-Lite 专属池 60,000/5 小时、600,000/周；注册需手机号验证，最多 20 个 API Key。**注意**：免费档仅确认 6.8 Flash Lite 与 U1 Fast，因 U1 命名存在文档 `U1.5 Lite/Fast` 与卡片 `U1 Fast` 出入暂不作备选默认；文档“模型总览”所列 DeepSeek V4.1 Flash / GLM-5.3 / Kimi K3 未列为免费档模型，是否在免费积分池内待用户实测）

## 验证命令

```bash
npm test       # 运行自动化测试（含多 Provider 路由、内容校验、安全拒答、Claim-Source 引用、API 流式与路由回归）
npm run lint   # ESLint 代码规范检查
npm run build  # Next.js 生产构建与 TypeScript 类型检查
```

## 许可说明

本项目保留原仓库 MIT License 与 `Copyright (c) 2026 ZackZhang-AI` 声明，并在 `LICENSE` 中附加说明：

> 郑栩重做版，基于 MIT 许可复用结构与方法，内容已全部替换
