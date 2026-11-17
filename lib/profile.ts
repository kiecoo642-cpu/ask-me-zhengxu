export const profile = {
  name: "郑栩",
  role: "AI 产品经理候选人",
  school: "东华大学",
  schoolTags: ["211", "双一流"],
  major: "信息管理与信息系统",
  graduation: "2024—2028 届本科",
  gpa: "GPA 3.6/4.0（专业前 10%）",
  availability: "每周 5 天 · 连续 6 个月 · 1 周内到岗",
} as const;

export const featuredProjects = [
  {
    name: "IHG AI 人才匹配系统（aTalent 实习）",
    summary: "高管端 App + 智能语音助手双轨采集与向量匹配，覆盖大中华区 500+ 酒店、3000+ 活跃用户，初筛 8h -> 1.5h（85% 采纳率分母待澄清）。",
    stack: "HR SaaS / 语音助手 / 向量相似度匹配 / MVP",
    question: "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
    status: "已完成 MVP 落地",
  },
  {
    name: "IHG 人才库 RAG 问答助手 & 模型选型",
    summary: "向量召回 + Rerank（Top 20 -> Top 5）与 Redis 短期记忆，按岗位配多助手并完成 5 轮 30 条内部 QA；基于 L1–L4 分层给出分场景模型选型矩阵。",
    stack: "RAG / Rerank / Redis / L1–L4 模型选型",
    question: "你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？",
    status: "5 轮内部 QA & 选型矩阵已审批",
  },
  {
    name: "百川智能医疗 RAG & 独立评测设计",
    summary: "负责百川医疗 RAG 评测模块（3 轮 30 次共用数据，多跳 4.38 风险信号），并完成 Seedance 视频六维评测、千问渠道调研（30 条资料库）。",
    stack: "医疗 RAG 评测 / 多跳归因 / Seedance / DRACO 渠道调研",
    question: "你在百川智能的医疗 RAG 项目具体做了什么？",
    status: "评测模块与方案设计完成",
  },
] as const;
