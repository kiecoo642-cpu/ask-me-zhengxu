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
      "请介绍一下你自己。",
      "你为什么适合 AI 产品经理岗位？",
      "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
      "你在东华大学的教育背景和可到岗时间是什么？",
    ],
  },
  {
    id: "projects",
    label: "项目与评测",
    questions: [
      "哪个项目最能代表你的 AI 产品能力？",
      "电商 Agent 评测沙箱是如何把完成率从 56% 提升到 88% 的？",
      "中文帮助文档 RAG 评测有哪些关键发现和短板？",
      "Claude Jira 工单工具是如何提效的？",
    ],
  },
  {
    id: "experience",
    label: "实习与业务",
    questions: [
      "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
      "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
      "你在 aTalent 还服务过哪些其他客户？",
      "信息管理与信息系统专业如何帮助你做 AI 产品？",
    ],
  },
  {
    id: "capabilities",
    label: "能力与边界",
    questions: [
      "你掌握哪些产品原型与协作工具？",
      "参数预检和预算熔断在 Agent 沙箱里起什么作用？",
      "你的主要短板和待澄清口径有哪些？",
      "Ask Me 郑栩版数字分身是如何保证不编造事实的？",
    ],
  },
] as const;

export type QuestionGroupId = (typeof questionGroups)[number]["id"];

const followUpsByCategory: Record<QuestionCategory, readonly string[]> = {
  profile: [
    "他为什么适合 AI 产品经理岗位？",
    "他在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
    "他在东华大学的教育背景和可到岗时间是什么？",
  ],
  fit: [
    "哪个项目最能代表他的 AI 产品能力？",
    "如果入职 AI 产品团队，他最先能承担哪些工作？",
    "他的主要短板和待澄清口径有哪些？",
  ],
  project: [
    "电商 Agent 评测沙箱是如何把完成率从 56% 提升到 88% 的？",
    "中文帮助文档 RAG 评测有哪些关键发现和短板？",
    "他在项目中最关键的产品取舍或挑战是什么？",
  ],
  experience: [
    "他在 aTalent 还服务过哪些其他客户？",
    "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
    "信息管理与信息系统专业如何帮助他做 AI 产品？",
  ],
  skills: [
    "他掌握哪些产品原型与协作工具？",
    "Claude Jira 工单工具是如何提效的？",
    "为什么 RAG 评测要把检索和引用分开评估？",
  ],
  gaps: [
    "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
    "口语化提问在 9 组配置中都未命中 Top-1，后续会怎么改？",
    "Ask Me 郑栩版数字分身是如何保证不编造事实的？",
  ],
  security: [
    "涉及企业客户数据或个人隐私时他怎么处理？",
    "Ask Me 郑栩版数字分身是如何保证不编造事实的？",
    "他的主要短板和待澄清口径有哪些？",
  ],
  other: [
    "请介绍一下你自己。",
    "他为什么适合 AI 产品经理岗位？",
    "哪个项目最能代表他的 AI 产品能力？",
  ],
};

const evergreenRecruiterQuestions = [
  "如果入职 AI 产品团队，他最先能承担哪些工作？",
  "信息管理与信息系统专业如何帮助他做 AI 产品？",
  "参数预检和预算熔断在 Agent 沙箱里起什么作用？",
  "为什么 RAG 评测要把检索和引用分开评估？",
  "口语化提问在 9 组配置中都未命中 Top-1，后续会怎么改？",
  "他在项目中最关键的产品取舍或挑战是什么？",
  "涉及企业客户数据或个人隐私时他怎么处理？",
] as const;

const explorationQuestionsByCategory: Record<QuestionCategory, readonly string[]> = {
  profile: [
    "中文帮助文档 RAG 评测有哪些关键发现和短板？",
    "电商 Agent 评测沙箱是如何把完成率从 56% 提升到 88% 的？",
  ],
  fit: [
    "他在 aTalent 还服务过哪些其他客户？",
    "信息管理与信息系统专业如何帮助他做 AI 产品？",
  ],
  project: [
    "他在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
    "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
  ],
  experience: [
    "电商 Agent 评测沙箱是如何把完成率从 56% 提升到 88% 的？",
    "Claude Jira 工单工具是如何提效的？",
  ],
  skills: [
    "他在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
    "他在东华大学的教育背景和可到岗时间是什么？",
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
    "他在东华大学的教育背景和可到岗时间是什么？",
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
  if (/项目|rag|agent|沙箱|ihg|atalent|jira|claude|完成率|口语化|预检|熔断/.test(question.toLowerCase())) return "project";
  if (/匹配|岗位|适合|入职|承担|优势|推荐/.test(question)) return "fit";
  if (/实习|春风动力|惠灵顿|客户|专业|信息管理|信管/.test(question)) return "experience";
  if (/技能|工具|sql|prd|figma|飞书|学生会|审批流|生成式ui|分开评估/.test(question.toLowerCase())) return "skills";
  if (/短板|不足|缺口|待澄清|分母|边界|风险/.test(question)) return "gaps";
  if (/隐私|机密|提示词|忽略|编造|私人|不编造/.test(question)) return "security";
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
    matcher: /评估|评测|指标|分母|待澄清|recall|mrr|引用|预检|熔断|做了什么|贡献|到岗/i,
    fallbacks: [
      "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
      "中文帮助文档 RAG 评测有哪些关键发现和短板？",
      "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
    ],
  },
  {
    kind: "retrospective",
    label: "项目复盘",
    matcher: /取舍|挑战|复盘|短板|口语化|怎么改|提升到|提效/i,
    fallbacks: [
      "电商 Agent 评测沙箱是如何把完成率从 56% 提升到 88% 的？",
      "口语化提问在 9 组配置中都未命中 Top-1，后续会怎么改？",
      "你在项目中最关键的产品取舍或挑战是什么？",
    ],
  },
  {
    kind: "fit",
    label: "岗位匹配",
    matcher: /适合|岗位|价值|承担|优势|教育|背景|介绍/,
    fallbacks: [
      "你为什么适合 AI 产品经理岗位？",
      "如果入职 AI 产品团队，你最先能承担哪些工作？",
      "你在东华大学的教育背景和可到岗时间是什么？",
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
