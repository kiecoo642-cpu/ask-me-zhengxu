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
| `AI_PROVIDER` | 模型 Provider 标识（默认 `deepseek`，可选 `gemini` / `openrouter` / `groq` / `together` / `openai` / `openai-compatible`） | 可选 |
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

- **Google Gemini（OpenAI-compatible）**：`AI_PROVIDER=gemini`、`AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/`、`GEMINI_API_KEY=<your-key>`、`AI_MODEL=gemini-3.5-flash`
- **OpenRouter**：`AI_PROVIDER=openrouter`、`AI_BASE_URL=https://openrouter.ai/api/v1`、`OPENROUTER_API_KEY=<your-key>`、`AI_MODEL=deepseek/deepseek-chat`
- **Groq**：`AI_PROVIDER=groq`、`AI_BASE_URL=https://api.groq.com/openai/v1`、`GROQ_API_KEY=<your-key>`、`AI_MODEL=llama-3.3-70b-versatile`
- **Together AI**：`AI_PROVIDER=together`、`AI_BASE_URL=https://api.together.xyz/v1`、`TOGETHER_API_KEY=<your-key>`、`AI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo`

## 验证命令

```bash
npm test       # 运行自动化测试（含多 Provider 路由、内容校验、安全拒答、Claim-Source 引用、API 流式与路由回归）
npm run lint   # ESLint 代码规范检查
npm run build  # Next.js 生产构建与 TypeScript 类型检查
```

## 许可说明

本项目保留原仓库 MIT License 与 `Copyright (c) 2026 ZackZhang-AI` 声明，并在 `LICENSE` 中附加说明：

> 郑栩重做版，基于 MIT 许可复用结构与方法，内容已全部替换
