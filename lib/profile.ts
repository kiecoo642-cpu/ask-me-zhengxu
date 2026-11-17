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
    name: "IHG AI 人才匹配 & 人才库 RAG 助手（aTalent 实习）",
    summary: "高管端 App + 智能语音助手双轨采集与向量匹配，覆盖 500+ 酒店、3000+ 活跃用户，初筛 8h -> 1.5h（85% 采纳率分母待澄清）；并交付多助手 RAG 问答（5 轮 30 条 QA）。",
    stack: "HR SaaS / 语音助手 / 向量匹配 / RAG & Rerank",
    question: "请介绍一下你的 aTalent 实习。",
    status: "已完成 MVP 落地",
  },
  {
    name: "百川智能医疗 RAG 知识助手（百川智能实习）",
    summary: "面向 10+ 医疗客户构建四层架构与 Dense+Rerank 溯源检索、Redis 多助手短期记忆，并搭建四维自动化评测（3 轮 30 次、单跳 9.71 vs 多跳 4.38 风险信号）。",
    stack: "医疗 RAG / 四层架构 / 四维自动化评测 / Bad Case 归因",
    question: "请介绍一下你的百川智能实习。",
    status: "完成评测闭环与风险定位",
  },
  {
    name: "WebDev E2E Bench 端到端评测系统",
    summary: "调研 13 项 Benchmark，构建 6 类任务七维 3 Gate 体系，完成 6 模型 36 次 Pilot 与 18 份盲评校准（Gold 6/6、Spearman 0.6191），协议诊断推动复杂样本 16.04 -> 69.07。",
    stack: "E2E Benchmark / 七维 Gate / 盲评校准 / 协议诊断 A/B",
    question: "WebDev E2E Bench 端到端评测系统是怎么设计的？",
    status: "完成盲评校准与 A/B 诊断",
  },
] as const;
