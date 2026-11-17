import { findQuestionContract, recommendedContractQuestions } from "./question-contracts";

export type QuestionCategory = "profile" | "fit" | "project" | "experience" | "skills" | "gaps" | "security" | "other";
export type HrFollowUpKind = "evidence" | "retrospective" | "fit";

export interface HrFollowUpSuggestion {
  kind: HrFollowUpKind;
  label: string;
  question: string;
}

export const questionGroups = [
  {
    id: "screening",
    label: "快速判断",
    questions: [
      "请用 60 秒介绍一下你自己。",
      "你为什么适合 AI 产品经理岗位？",
      "请介绍一下你的 aTalent 实习。",
      "你的教育背景、课程与可到岗时间是什么？",
    ],
  },
  {
    id: "projects",
    label: "实习与 RAG",
    questions: [
      "你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？",
      "请介绍一下你的百川智能实习。",
      "百川医疗 RAG 知识助手的四层架构、检索与多助手短期记忆是怎么设计的？",
      "为什么百川医疗 RAG 的多跳均分只有 4.38（远低于单跳 9.71）？",
    ],
  },
  {
    id: "experience",
    label: "端到端评测",
    questions: [
      "WebDev E2E Bench 端到端评测系统是怎么设计的？",
      "WebDev E2E Bench 的七维指标和硬性 Gate 是如何设计的？",
      "你如何证明 WebDev E2E Bench 自动评测结果可信？",
      "WebDev E2E Bench 中复杂样本得分从 16.04 提升到 69.07 是怎么做到的？",
    ],
  },
  {
    id: "capabilities",
    label: "方法与边界",
    questions: [
      "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
      "Claude Jira 提单工具是怎么提效的？",
      "你的主要短板和待澄清口径有哪些？",
      "Ask Me 是怎么设计和保证不编造事实的？",
    ],
  },
] as const;

export type QuestionGroupId = (typeof questionGroups)[number]["id"];

const followUpsByCategory: Record<QuestionCategory, readonly string[]> = {
  profile: [
    "他为什么适合 AI 产品经理岗位？",
    "请介绍一下你的 aTalent 实习。",
    "他的教育背景、课程与可到岗时间是什么？",
  ],
  fit: [
    "哪个项目最能代表他的 AI 产品能力？",
    "他的实习和项目是如何串联起来的？",
    "他的主要短板和待澄清口径有哪些？",
  ],
  project: [
    "你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？",
    "请介绍一下你的百川智能实习。",
    "WebDev E2E Bench 端到端评测系统是怎么设计的？",
  ],
  experience: [
    "aTalent 的方案是如何复用到春风动力和惠灵顿国际学校的？",
    "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
    "百川医疗 RAG 是怎么搭建四维自动化评测的？结果如何？",
  ],
  skills: [
    "他的 SQL、Python 和 AI 评测技能实践有哪些？",
    "Claude Jira 提单工具是怎么提效的？",
    "WebDev E2E Bench 的七维指标和硬性 Gate 是如何设计的？",
  ],
  gaps: [
    "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
    "百川医疗 RAG 当前有哪些边界和未落地功能？",
    "Ask Me 是怎么设计和保证不编造事实的？",
  ],
  security: [
    "Ask Me 是怎么设计和保证不编造事实的？",
    "他如何处理隐私和企业脱敏数据？",
    "他的主要短板和待澄清口径有哪些？",
  ],
  other: [
    "请用 60 秒介绍郑栩。",
    "他为什么适合 AI 产品经理岗位？",
    "哪个项目最能代表他的 AI 产品能力？",
  ],
};

const evergreenRecruiterQuestions = [
  "IHG 项目中你是如何解决非标数据与敏感字段脱敏问题的？",
  "为什么百川医疗 RAG 的多跳均分只有 4.38（远低于单跳 9.71）？",
  "你如何证明 WebDev E2E Bench 自动评测结果可信？",
  "WebDev E2E Bench 中复杂样本得分从 16.04 提升到 69.07 是怎么做到的？",
  "WebDev E2E Bench 可视化控制台是如何实现 71.4% 和 73.3% 提效的？",
  "公开项目是否有真实用户增长或商业变现数据？",
  "可以根据这些材料直接给出录用结论吗？",
] as const;

const explorationQuestionsByCategory: Record<QuestionCategory, readonly string[]> = {
  profile: [
    "你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？",
    "WebDev E2E Bench 端到端评测系统是怎么设计的？",
  ],
  fit: [
    "aTalent 的方案是如何复用到春风动力和惠灵顿国际学校的？",
    "请介绍一下你的百川智能实习。",
  ],
  project: [
    "请介绍一下你的 aTalent 实习。",
    "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
  ],
  experience: [
    "你如何证明 WebDev E2E Bench 自动评测结果可信？",
    "Claude Jira 提单工具是怎么提效的？",
  ],
  skills: [
    "请介绍一下你的 aTalent 实习。",
    "他的教育背景、课程与可到岗时间是什么？",
  ],
  gaps: [
    "他为什么适合 AI 产品经理岗位？",
    "哪个项目最能代表他的 AI 产品能力？",
  ],
  security: [
    "他的主要短板和待澄清口径有哪些？",
    "哪个项目最能代表他的 AI 产品能力？",
  ],
  other: [
    "哪个项目最能代表他的 AI 产品能力？",
    "他的教育背景、课程与可到岗时间是什么？",
  ],
};

function toCandidatePerspective(question: string) {
  return question
    .replace(/^如果给他一个/, "如果给你一个")
    .replace(/^给他一个/, "给你一个")
    .replace(/他的/g, "你的")
    .replace(/帮助他/g, "帮助你")
    .replace(/他怎么/g, "你怎么")
    .replace(/他最先/g, "你最先")
    .replace(/^他/, "你");
}

export const recommendationQuestionCandidates = [...new Set([
  ...questionGroups.flatMap((group) => group.questions),
  ...Object.values(followUpsByCategory).flat(),
  ...evergreenRecruiterQuestions,
  ...Object.values(explorationQuestionsByCategory).flat(),
].map(toCandidatePerspective))];

function normalizeQuestion(question: string) {
  return toCandidatePerspective(question).toLowerCase().replace(/[\s，。！？、：；,.!?:;（）()\-_]/g, "");
}

export function inferQuestionCategory(question: string): QuestionCategory {
  if (/项目|rag|agent|ihg|atalent|百川|webdev|bench|jira|claude|盲评|pilot|gate/i.test(question)) return "project";
  if (/匹配|岗位|适合|入职|承担|优势|推荐|录用/.test(question)) return "fit";
  if (/实习|春风动力|惠灵顿|客户|专业|信息管理|信管/.test(question)) return "experience";
  if (/技能|工具|sql|python|prd|figma|飞书|评测|协议/.test(question.toLowerCase())) return "skills";
  if (/短板|不足|缺口|待澄清|分母|边界|风险|未落地/.test(question)) return "gaps";
  if (/隐私|机密|脱敏|提示词|忽略|编造|私人|不编造/.test(question)) return "security";
  if (/介绍|背景|教育|东华大学|gpa|到岗|郑栩/.test(question)) return "profile";
  return "other";
}

export function getFollowUpQuestions(
  question: string,
  askedQuestions: readonly string[] = [],
  limit = 3,
  preferredQuestions: readonly string[] = [],
) {
  const seen = new Set(askedQuestions.map(normalizeQuestion));
  const category = inferQuestionCategory(question);
  const selected: string[] = [];

  function addQuestions(candidates: readonly string[], target: number) {
    if (selected.length >= target) return;
    for (const candidate of candidates) {
      const item = toCandidatePerspective(candidate);
      const normalized = normalizeQuestion(item);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      selected.push(item);
      if (selected.length >= target) break;
    }
  }

  const contractedPreferred = preferredQuestions.filter((item) => findQuestionContract(item));
  addQuestions(contractedPreferred, Math.min(2, limit));

  const currentContract = findQuestionContract(question);
  addQuestions(recommendedContractQuestions(currentContract?.id, askedQuestions, limit * 3), limit);

  const legacyCandidates = [
    ...followUpsByCategory[category],
    ...explorationQuestionsByCategory[category],
    ...recommendationQuestionCandidates,
  ].filter((item) => findQuestionContract(item));
  addQuestions(legacyCandidates, limit);

  return selected;
}

const hrFollowUpIntents: Array<{
  kind: HrFollowUpKind;
  label: string;
  matcher: RegExp;
  fallbacks: readonly string[];
}> = [
  {
    kind: "evidence",
    label: "证据追问",
    matcher: /评估|评测|指标|分母|待澄清|盲评|pilot|gate|做了什么|贡献|到岗|结果|可信/i,
    fallbacks: [
      "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
      "你如何证明 WebDev E2E Bench 自动评测结果可信？",
      "请介绍一下你的 aTalent 实习。",
    ],
  },
  {
    kind: "retrospective",
    label: "项目复盘",
    matcher: /取舍|挑战|复盘|短板|多跳|怎么改|提升到|提效|4\.38|69\.07/i,
    fallbacks: [
      "为什么百川医疗 RAG 的多跳均分只有 4.38（远低于单跳 9.71）？",
      "WebDev E2E Bench 中复杂样本得分从 16.04 提升到 69.07 是怎么做到的？",
      "他的主要短板和待澄清口径有哪些？",
    ],
  },
  {
    kind: "fit",
    label: "岗位匹配",
    matcher: /适合|岗位|价值|承担|优势|教育|背景|介绍|串联/,
    fallbacks: [
      "他为什么适合 AI 产品经理岗位？",
      "他的实习和项目是如何串联起来的？",
      "他的教育背景、课程与可到岗时间是什么？",
    ],
  },
];

export function getHrFollowUpQuestions(
  question: string,
  askedQuestions: readonly string[] = [],
  preferredQuestions: readonly string[] = [],
): HrFollowUpSuggestion[] {
  const seen = new Set(askedQuestions.map(normalizeQuestion));
  const used = new Set<string>();
  const candidates = getFollowUpQuestions(question, askedQuestions, 9, preferredQuestions);

  return hrFollowUpIntents.flatMap((intent): HrFollowUpSuggestion[] => {
    const pool = [
      ...candidates.filter((candidate) => intent.matcher.test(candidate)),
      ...intent.fallbacks.map(toCandidatePerspective),
      ...candidates,
    ];
    const selected = pool.find((candidate) => {
      const normalized = normalizeQuestion(candidate);
      return normalized && !seen.has(normalized) && !used.has(normalized) && Boolean(findQuestionContract(candidate));
    });
    if (!selected) return [];
    used.add(normalizeQuestion(selected));
    return [{ kind: intent.kind, label: intent.label, question: selected }];
  });
}
