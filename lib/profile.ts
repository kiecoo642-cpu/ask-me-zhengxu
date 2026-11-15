export const profile = {
  name: "郑栩",
  role: "AI 产品经理候选人",
  school: "东华大学",
  schoolTags: ["211", "双一流"],
  major: "信息管理与信息系统",
  graduation: "2024—2028 届本科",
  gpa: "GPA 3.3/4.0（专业前 10%）",
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
    name: "电商多步决策 Agent 与离线评测沙箱",
    summary: "意图解析 -> 工具调用 -> 沙箱预检 -> 离线评测，参数预检 + 预算熔断，30+ 类指令回归集完成率 56% -> 88%。",
    stack: "Multi-step Agent / 离线沙箱 / 参数预检 / 预算熔断",
    question: "电商 Agent 评测沙箱是如何把完成率从 56% 提升到 88% 的？",
    status: "离线回归完成",
  },
  {
    name: "中文帮助文档 RAG 检索与引用评测",
    summary: "45 篇文档 × 30 条证据句评测集，9 组配置对比；整篇+向量 Recall@5 1.000 / MRR 0.983 / 引用准确率 0.967。",
    stack: "BM25 / bge-small-zh / RRF / 检索与引用分离评测",
    question: "中文帮助文档 RAG 评测有哪些关键发现和短板？",
    status: "9 组实验完成",
  },
] as const;
