import { z } from "zod";
import { candidateNarrative } from "../content/narrative";
import { stableAnswerContent } from "../content/qa";
import type { AnswerIntent, EvidencePolicy, QuestionContract, QuestionFacet, QuestionFrame, QuestionMode, QuestionTopic, ResponseShape } from "./types";

const topics = [
  "profile",
  "role_fit",
  "education",
  "atalent",
  "agent_sandbox",
  "rag_eval",
  "jira_tool",
  "campus",
  "rag",
  "ask_me",
  "skills",
  "enterprise_ai",
  "agent",
  "unknown",
] as const;
const facets = ["overview", "problem", "method", "contribution", "architecture", "collaboration", "evaluation", "transfer", "example", "result", "boundary", "fit"] as const;
const answerIntents = ["agent_identity", "capability_scope", "introduction", "career_transition", "role_fit", "representative_project", "project_overview", "project_problem", "contribution", "ai_collaboration", "challenge", "diagnosis", "result", "limitation", "skills", "experience", "experience_value", "privacy", "education", "credentials", "hiring_recommendation", "general"] as const;

const careerTransitionPattern = /(?:为什么|为何).{0,12}(?:(?:从)?(?:信息管理|信管)(?:背景|专业|经历)?.{0,12}(?:转向|转型|选择|改做|走到|进入)).{0,12}(?:AI\s*产品|产品经理|产品)/i;
const careerTransitionContextPattern = /(?:信息管理|信管).{0,24}(?:产品|AI).{0,14}(?:连续|迁移|选择|适合|方向|准备)|(?:为什么|为何|如何|怎么).{0,12}(?:转型|转向|选择).{0,14}(?:AI|产品)/i;
const careerTransitionActionPattern = /(?:转型|转向|改做|走到|进入|选择.{0,12}(?:AI|产品)|连续性|做了哪些准备)/i;
const experienceValuePattern = /(?:(?:信息管理|信管|所学|你的|他的|候选人的)(?:这个)?专业(?:背景)?|专业背景|之前的?经历|过往经历).{0,28}(?:对.{0,12})?(?:做|求职|支持|帮助|价值|作用|迁移|产品判断).{0,16}(?:AI\s*产品|产品|决策|能力)?/i;

export function hasCareerTransitionSignature(question: string) {
  return careerTransitionActionPattern.test(question)
    && (careerTransitionPattern.test(question) || careerTransitionContextPattern.test(question));
}

export function hasExperienceValueSignature(question: string) {
  return experienceValuePattern.test(question);
}

const roleFitPattern = /匹配(?:之处|点|度|证据)?|契合(?:之处|点|度)?|适合|胜任|为什么.{0,8}(?:选择你|选你)|能为.{0,16}(?:岗位|岗|团队|业务).{0,8}(?:带来|创造)|与.{0,18}(?:岗位|岗).{0,8}(?:关系|匹配)/i;
const resultEvidencePattern = /(?:有没有|是否|能否证明|做过|负责过|实现过|取得|形成|达到|已经|目前).{0,16}(?:商业化|变现|营收|收入|增长|用户|留存|上线|结果|成果|规模)|(?:商业化|变现|营收|收入|增长|用户|留存|上线).{0,12}(?:数据|结果|成果|规模|经验|案例|证明|做过|负责过|实现过)/i;

export function extractTargetRole(question: string) {
  const isGenericReference = (value: string) => /^(?:(?:这个|该|上述|刚才的|前面提到的|目标)(?:岗位|职位|岗)|(?:岗位|职位|岗))$/i.test(value.trim());
  const namedRole = question.match(/((?:企业|商业分析|智能客服|AI|商业化|增长|搜索|数据|策略|平台|企业服务|B\s*端|C\s*端|广告|用户|内容|推荐|国际化|电商|支付|风控|运营|智能体|Agent)[A-Za-z0-9\u4e00-\u9fa5·+\-\s]{0,10}(?:产品经理|PM))/i)?.[1];
  if (namedRole) return namedRole.replace(/\s+/g, " ").trim();
  const contextualRole = question.match(/(?:和|与|应聘|申请|面试|目标是?|针对)\s*([^，。！？?]{2,24}?(?:产品经理|PM|工程师|设计师|运营|分析师|岗位))(?=这个岗|该岗|岗位|职位|有什么|有哪些|的匹配|匹配|契合|适合|可迁移)/i)?.[1];
  if (contextualRole && !isGenericReference(contextualRole)) return contextualRole.trim();
  const broadRole = question.match(/(?:适合|胜任|匹配)(?:做|从事)?\s*(?!什么|哪些|哪种|哪类)([^，。！？?]{2,20}(?:产品|岗位|方向))/i)?.[1];
  return broadRole && !isGenericReference(broadRole) ? broadRole.trim() : undefined;
}

export function inferAnswerIntent(question: string, topic: QuestionTopic = "unknown", facet: QuestionFacet = "overview"): AnswerIntent {
  if (/^(?:(?:你|您)?(?:是谁|叫什么(?:名字)?|是什么(?:身份|助手|Agent|角色)?|的身份是什么)|(?:请)?(?:介绍|说明)(?:一下)?你的身份)[？?。.！!\s]*$/i.test(question)) return "agent_identity";
  if (/^(?:(?:你|您)(?:能|可以)(?:做|回答|介绍|帮我)(?:些什么|什么|哪些(?:问题|内容|开放题)?)?|你有什么(?:作用|用处|功能)|你是做什么的|你能干什么|你可以干什么|能问你什么|可以问什么|功能范围|能力范围|你不能回答开放(?:问题|题目)?(?:吗)?|你能回答(?:开放|没有标准答案的)?(?:问题|题目|题)?(?:吗)?|.*(?:Agent|助手).{0,8}(?:能不能|可以不可以|能否)?回答.{0,12}(?:开放|标准答案|问题))[？?。.！!\s]*$/i.test(question)) return "capability_scope";
  if (hasCareerTransitionSignature(question)) return "career_transition";
  if (roleFitPattern.test(question)) return "role_fit";
  if (/AI\s*(?:编程|写|生成)|代码.*AI|AI.*占比|用了多少\s*AI/i.test(question)) return "ai_collaboration";
  if (/挑战|困难|失败|取舍|踩坑|复盘|怎么推进|如何推进/i.test(question)) return "challenge";
  if (/^(?:如果|假设|当)/.test(question) && /(?:怎么办|怎么|如何|怎样)/.test(question)) return "diagnosis";
  if (resultEvidencePattern.test(question)) return "result";
  if (/个人贡献|你做了什么|你负责|具体做了|你的工作|主导/i.test(question)) return "contribution";
  if (/没有改善|没改善|没有效果|没效果|优先排查|先排查|先.{0,3}看什么|定位问题|(?:如何|怎么).{0,4}定位|为什么没有/i.test(question)) return "diagnosis";
  if (/隐私|机密|企业数据|数据边界/i.test(question)) return "privacy";
  if (/短板|不足|弱点|限制|能力缺口|待澄清|分母/i.test(question) || facet === "boundary") return "limitation";
  if (/结果|量化(?:结果|效果)|效果数据|用户规模|增长|留存|上线|生产状态|完成(?:了吗|情况)/i.test(question) || facet === "result") return "result";
  if (/代表项目|最能代表|最有价值的项目/i.test(question)) return "representative_project";
  if (/自我介绍|介绍一下自己|60\s*秒|30\s*秒|90\s*秒/i.test(question)) return "introduction";
  if (/东华大学|学历|就读|学校|院校|gpa|前\s*10%|到岗|实习时间|每周/i.test(question)) return "education";
  if (/(?:项目|系统|工具|助手).{0,10}(?:能做什么|做什么|有什么功能|如何工作)/i.test(question)) return "project_overview";
  if (hasExperienceValueSignature(question)) return "experience_value";
  if (/技术能力|技术栈|会什么|工具|sql|prd|figma|飞书|评测|如何评估|有哪些实践/i.test(question) || facet === "evaluation") return "skills";
  if (facet === "contribution") return "contribution";
  if ((facet === "fit" && topic === "role_fit") || topic === "role_fit") return "role_fit";
  if (["atalent", "agent_sandbox", "rag_eval", "rag", "jira_tool", "campus", "ask_me", "agent"].includes(topic)) return "project_overview";
  return "general";
}

function questionModeFor(question: string, intent: AnswerIntent): QuestionMode {
  if (["agent_identity", "capability_scope"].includes(intent)) return "agent_meta";
  if (["skills", "experience_value", "ai_collaboration", "introduction", "career_transition", "role_fit", "representative_project", "project_overview", "project_problem", "contribution", "result", "experience", "education", "credentials", "limitation", "hiring_recommendation"].includes(intent)) return "candidate_fact";
  if (/^(?:如果|假设|当|遇到假设|你会如何|你怎么看|如何看待|面对|遇到|如何处理|怎么处理|如何|怎么|你(?:平时|通常)?如何|你(?:平时|通常)?怎样|你会怎么)/.test(question)) return "candidate_reasoning";
  return "candidate_fact";
}

function evidencePolicyFor(intent: AnswerIntent, mode: QuestionMode): EvidencePolicy {
  if (mode === "agent_meta") return "none";
  if (mode === "candidate_reasoning") return "supporting";
  if (["result", "contribution", "experience", "education", "credentials", "career_transition"].includes(intent)) return "required";
  return "supporting";
}

function focusTermsFor(intent: AnswerIntent, targetRole?: string) {
  if (intent === "role_fit") return [targetRole ?? "目标岗位", "岗位要求", "经历证据", "可迁移价值"];
  if (intent === "result") return ["已验证结果", "证据边界"];
  if (intent === "challenge" || intent === "diagnosis") return ["问题判断", "处理过程", "复盘改进"];
  return ["当前问题", "相关实践", "判断依据"];
}

export const plannedQuestionFrameSchema = z.object({
  topic: z.enum(topics),
  facet: z.enum(facets),
  answerIntent: z.enum(answerIntents),
  questionMode: z.enum(["agent_meta", "candidate_fact", "candidate_reasoning"]).default("candidate_fact"),
  evidencePolicy: z.enum(["required", "supporting", "none"]).default("supporting"),
  focusTerms: z.array(z.string().min(2).max(30)).min(1).max(4),
  targetRole: z.string().min(2).max(30).optional(),
  requestedDimensions: z.array(z.string().min(2).max(30)).min(1).max(4),
  activeProject: z.enum(["atalent-ihg", "agent-eval-sandbox", "rag-retrieval-eval", "jira-tool", "campus-workflow", "ask-me"]).optional(),
  useHistory: z.boolean(),
  confidence: z.number().min(0).max(1),
});

const topicKnowledge: Record<QuestionTopic, string[]> = {
  profile: ["K1", "K2", "K3", "K4", "K6", "K7", "K11"],
  role_fit: ["K2", "K4", "K5", "K6", "K7", "K8", "K9"],
  education: ["K3", "K1"],
  atalent: ["K4", "K5", "K11"],
  agent_sandbox: ["K6", "K11"],
  rag_eval: ["K7", "K11"],
  rag: ["K7", "K11"],
  jira_tool: ["K8", "K9"],
  campus: ["K9", "K3"],
  ask_me: ["K10", "K11"],
  skills: ["K9", "K8", "K6", "K7"],
  enterprise_ai: ["K4", "K5", "K11"],
  agent: ["K6", "K10"],
  unknown: [],
};

const topicPatterns: Array<[QuestionTopic, RegExp]> = [
  ["atalent", /atalent|ihg|洲际|人才匹配|语音助手|高管端|春风动力|惠灵顿/i],
  ["agent_sandbox", /沙箱|参数预检|预算熔断|56%|88%|30\+|多步决策/i],
  ["rag_eval", /rag|bm25|bge-small-zh|rrf|recall@5|mrr|引用准确率|120\s*字符|口语化|帮助文档/i],
  ["jira_tool", /jira|claude|提单|5\s*分钟|1\s*分钟/i],
  ["campus", /学生会|审批流|飞书|多维表格|wiki|生成式\s*ui|figma|prd|sql/i],
  ["education", /东华大学|信息管理|信管|gpa|3\.3|前\s*10%|到岗|6\s*个月|每周/i],
  ["ask_me", /ask\s*me|数字分身|不编造|claim|source/i],
  ["agent", /agent|智能体/i],
  ["enterprise_ai", /企业级?\s*ai|企业场景|隐私|脱敏/i],
  ["role_fit", /岗位|匹配|适合|胜任|优势|入职|承担/i],
  ["profile", /自我介绍|介绍一下|郑栩|短板|不足|待澄清/i],
  ["skills", /技能|工具|技术/i],
];

const facetPatterns: Array<[QuestionFacet, RegExp]> = [
  ["example", /举例|例子|案例/i],
  ["contribution", /贡献|负责|做了什么|核心工作|职责/i],
  ["collaboration", /协作|分工|配合/i],
  ["evaluation", /评测|评估|指标|验收|效果|质量|错误|失败|bad\s*case/i],
  ["transfer", /迁移|沉淀|帮助|支持/i],
  ["result", /结果|成果|完成|上线|规模|提升/i],
  ["boundary", /短板|不足|限制|边界|风险|待澄清|分母/i],
  ["architecture", /架构|链路|技术方案/i],
  ["method", /方法|如何|怎么|思考|取舍/i],
  ["problem", /解决.*问题|什么问题|痛点/i],
  ["fit", /匹配|契合|适合|胜任|优势|价值/i],
];

function topicForAnswerId(id: string): QuestionTopic {
  if (["A01", "A16", "A17"].includes(id)) return "profile";
  if (["A02", "A19"].includes(id)) return "role_fit";
  if (["A03", "A04", "A05", "A06"].includes(id)) return "atalent";
  if (["A07", "A08", "A20"].includes(id)) return "agent_sandbox";
  if (["A09", "A10", "A11"].includes(id)) return "rag_eval";
  if (id === "A12") return "jira_tool";
  if (id === "A13") return "skills";
  if (["A14", "A15"].includes(id)) return "education";
  if (id === "A18") return "ask_me";
  return "profile";
}

function facetForAnswerId(id: string): QuestionFacet {
  if (["A05", "A16"].includes(id)) return "boundary";
  if (["A02", "A15", "A19"].includes(id)) return "fit";
  if (["A04"].includes(id)) return "contribution";
  if (["A07", "A09"].includes(id)) return "evaluation";
  if (["A08", "A10", "A11", "A20"].includes(id)) return "method";
  return "overview";
}

function projectForTopic(topic: QuestionTopic): QuestionFrame["activeProject"] {
  if (topic === "atalent") return "atalent-ihg";
  if (topic === "agent_sandbox" || topic === "agent") return "agent-eval-sandbox";
  if (topic === "rag_eval" || topic === "rag") return "rag-retrieval-eval";
  if (topic === "jira_tool") return "jira-tool";
  if (topic === "campus") return "campus-workflow";
  if (topic === "ask_me") return "ask-me";
  return undefined;
}

const nextIdsByContractId: Record<string, string[]> = {
  A01: ["A04", "A07", "A14"],
  A02: ["A03", "A09", "A16"],
  A03: ["A04", "A05", "A06"],
  A04: ["A05", "A06", "A07"],
  A05: ["A06", "A09", "A16"],
  A06: ["A04", "A07", "A13"],
  A07: ["A08", "A09", "A20"],
  A08: ["A09", "A12", "A04"],
  A09: ["A10", "A11", "A07"],
  A10: ["A11", "A12", "A13"],
  A11: ["A07", "A04", "A13"],
  A12: ["A13", "A07", "A14"],
  A13: ["A14", "A04", "A16"],
  A14: ["A01", "A04", "A02"],
  A15: ["A04", "A07", "A16"],
  A16: ["A04", "A09", "A02"],
  A17: ["A18", "A04", "A14"],
  A18: ["A01", "A04", "A07"],
  A19: ["A14", "A04", "A16"],
  A20: ["A08", "A09", "A16"],
};

const aliasesByContractId: Record<string, string[]> = {
  A01: ["60 秒了解郑栩。", "60秒了解郑栩。", "请介绍一下你自己", "介绍一下郑栩", "30秒自我介绍", "90秒自我介绍"],
  A02: ["你与 AI 产品经理岗位的匹配证据是什么？", "他为什么适合 AI 产品经理岗位？"],
  A03: ["哪个公开项目最能代表他的 AI 产品能力？", "代表项目是什么？"],
  A04: ["他在 aTalent 的 IHG AI 人才匹配项目具体做了什么？", "IHG 项目做了什么？"],
  A05: ["为什么说 IHG 85% 业务采纳率的分母口径待澄清？", "85% 采纳率的分母是什么？"],
  A06: ["他在 aTalent 还服务过哪些其他客户？", "春风动力和惠灵顿国际学校做了什么？"],
  A07: ["电商 Agent 评测沙箱是怎么提升到 88% 的？", "Agent 评测沙箱项目具体做了什么？"],
  A09: ["RAG 检索评测实验有哪些发现？", "中文帮助文档 RAG 评测结果如何？"],
  A14: ["郑栩是什么学校和专业？", "他的到岗时间和实习周期是多久？"],
  A16: ["他的主要短板和待核实问题是什么？"],
};

export const questionContracts: QuestionContract[] = stableAnswerContent.map((item) => {
  const topic = topicForAnswerId(item.id);
  const facet = facetForAnswerId(item.id);
  const answerIntent = item.factSkeleton.intent;
  const questionMode = questionModeFor(item.question, answerIntent);
  return {
    id: item.id,
    question: item.question,
    aliases: aliasesByContractId[item.id] ?? [],
    frame: {
      topic,
      facet,
      answerIntent,
      questionMode,
      evidencePolicy: evidencePolicyFor(answerIntent, questionMode),
      focusTerms: item.exclusivePoints.slice(0, 4),
      requestedDimensions: item.exclusivePoints.slice(0, 4),
      activeProject: item.relatedProject ?? projectForTopic(topic),
      useHistory: false,
      confidence: 1,
      requiredKnowledgeIds: item.id === "A16" ? ["K11", "K4", "K7", "K1"] : topicKnowledge[topic],
      allowedStoryIds: [...item.preferredStoryIds],
      forbiddenTopics: [],
      responseShape: item.responseShape,
      targetLength: item.targetLength,
      answerGoal: item.evaluationGoal,
    },
    thesis: item.factSkeleton.thesis,
    requiredPoints: [...item.exclusivePoints],
    directAnswerTerms: [...item.matchKeywords.slice(0, 4)],
    fallbackAnswer: item.standardAnswer,
    nextContractIds: nextIdsByContractId[item.id] ?? ["A01", "A02", "A03"],
    generationMode: "local",
  };
});

const contractById = new Map(questionContracts.map((contract) => [contract.id, contract]));

export function normalizeContractQuestion(value: string) {
  return value
    .toLowerCase()
    .replace(/郑栩/g, "候选人")
    .replace(/你的|他的/g, "候选人的")
    .replace(/你|他/g, "候选人")
    .replace(/[\s，。！？、：；,.!?:;（）()\-_]/g, "");
}

export function findQuestionContract(question: string) {
  const normalized = normalizeContractQuestion(question);
  return questionContracts.find((contract) => [contract.question, ...contract.aliases]
    .some((candidate) => normalizeContractQuestion(candidate) === normalized));
}

export function frameFromContract(contract: QuestionContract): QuestionFrame {
  return { ...contract.frame, routeSource: "contract" };
}

function responseShapeFor(facet: QuestionFacet): ResponseShape {
  if (facet === "example") return "star";
  if (facet === "contribution") return "contribution";
  if (facet === "fit") return "fit_mapping";
  if (facet === "result" || facet === "boundary") return "shortcoming";
  return "direct";
}

function forbiddenFor(topic: QuestionTopic) {
  if (topic === "unknown" || topic === "profile" || topic === "role_fit" || topic === "skills" || topic === "enterprise_ai") return [];
  return topics.filter((candidate) => ![topic, "unknown"].includes(candidate)) as QuestionTopic[];
}

export function buildLocalQuestionFrame(question: string, history: { role: "user" | "assistant"; content: string }[] = []): QuestionFrame {
  const contract = findQuestionContract(question);
  if (contract) return frameFromContract(contract);

  if (/^(?:你是谁|你叫什么|你的身份是什么|你能做什么|你可以做什么|你有什么(?:作用|用处|功能)|你是做什么的|你能干什么|你可以干什么|你不能回答开放(?:问题|题目)?(?:吗)?|你能回答开放(?:问题|题目)?(?:吗)?)[？?。.！!\s]*$/i.test(question)) {
    return {
      topic: "profile",
      facet: "overview",
      answerIntent: inferAnswerIntent(question, "profile", "overview"),
      questionMode: "agent_meta",
      evidencePolicy: "none",
      focusTerms: ["Agent 身份", "能力范围"],
      requestedDimensions: ["Agent 身份或能力范围"],
      useHistory: false,
      confidence: 0.98,
      requiredKnowledgeIds: [],
      allowedStoryIds: [],
      forbiddenTopics: [],
      responseShape: "direct",
      targetLength: { min: 120, max: 320 },
      answerGoal: "直接说明数字分身身份或可以回答的候选人信息范围。",
      routeSource: "local",
    };
  }

  const detectedTopic = topicPatterns.find(([, pattern]) => pattern.test(question))?.[0] ?? "unknown";
  const detectedFacet = facetPatterns.find(([, pattern]) => pattern.test(question))?.[0] ?? "overview";
  const initialIntent = inferAnswerIntent(question, detectedTopic, detectedFacet);
  const topic = ["career_transition", "experience_value"].includes(initialIntent) ? "profile" : initialIntent === "role_fit" ? "role_fit" : detectedTopic;
  const facet = ["career_transition", "experience_value"].includes(initialIntent) ? "transfer" : initialIntent === "role_fit" ? "fit" : initialIntent === "result" ? "result" : detectedFacet;
  const answerIntent = inferAnswerIntent(question, topic, facet);
  const targetRole = answerIntent === "role_fit"
    ? extractTargetRole(question) ?? [...history].reverse()
      .filter((message) => message.role === "user")
      .map((message) => extractTargetRole(message.content))
      .find(Boolean)
    : undefined;
  const questionMode = questionModeFor(question, answerIntent);
  const reference = /这个|该项目|其中|它|上述|这套|这种|这些|那些|那次|当时|刚才|前面/.test(question);
  const historyProject = [...history].reverse()
    .find((message) => message.role === "user" && /atalent|ihg|洲际|春风动力|惠灵顿|沙箱|rag|jira|claude|学生会|ask\s*me/i.test(message.content))
    ?.content.match(/atalent|ihg|洲际|春风动力|惠灵顿|沙箱|rag|jira|claude|学生会|ask\s*me/i)?.[0]?.toLowerCase();
  const inferredTopic: QuestionTopic = topic === "unknown" && reference
    ? (historyProject && /rag/.test(historyProject) ? "rag_eval"
      : historyProject && /沙箱/.test(historyProject) ? "agent_sandbox"
        : historyProject && /jira|claude/.test(historyProject) ? "jira_tool"
          : historyProject && /学生会/.test(historyProject) ? "campus"
            : historyProject?.includes("ask") ? "ask_me"
              : historyProject ? "atalent" : "unknown")
    : topic;
  const explicitTopic = inferredTopic !== "unknown";
  const hasMethodContext = /AI|产品|模型|RAG|Agent|沙箱|检索|评测|数据|用户|指标|需求|项目|功能|失败|复盘|取舍|协作|团队|岗位|工作|压力|冲突|学习|加班|职业|选择/i.test(question);
  const hasStrongLocalIntent = !["general", "project_overview", "challenge", "diagnosis"].includes(answerIntent)
    || (["challenge", "diagnosis"].includes(answerIntent) && hasMethodContext);
  const interviewReasoning = /(?:你怎么看|如何看待|你会如何|如果|假设|面对|遇到|为什么|为何|如何|怎么).{0,20}(?:岗位|工作|团队|压力|冲突|学习|加班|职业|选择|产品|AI|业务|协作|沟通|优先级)/i.test(question);

  return {
    topic: inferredTopic,
    facet,
    answerIntent,
    questionMode,
    evidencePolicy: evidencePolicyFor(answerIntent, questionMode),
    focusTerms: focusTermsFor(answerIntent, targetRole),
    targetRole,
    requestedDimensions: [facet === "overview" ? "直接回答当前问题" : `${facet}相关判断`, "具体实践", "验证或落地方式"],
    activeProject: projectForTopic(inferredTopic),
    useHistory: reference,
    confidence: ["career_transition", "role_fit"].includes(answerIntent) ? 0.92 : interviewReasoning ? 0.86 : hasStrongLocalIntent ? 0.88 : explicitTopic && facet !== "overview" ? 0.86 : explicitTopic ? 0.72 : facet !== "overview" ? 0.58 : 0.35,
    requiredKnowledgeIds: ["career_transition", "experience_value"].includes(answerIntent) ? ["K1", "K2", "K3", "K4", "K6", "K7"] : topicKnowledge[inferredTopic],
    allowedStoryIds: facet === "example" ? (inferredTopic === "atalent" ? ["ST1", "ST2"] : inferredTopic === "agent_sandbox" ? ["ST3"] : inferredTopic === "rag_eval" ? ["ST4"] : []) : [],
    forbiddenTopics: forbiddenFor(inferredTopic),
    responseShape: answerIntent === "career_transition" ? "narrative" : responseShapeFor(facet),
    targetLength: { min: facet === "overview" ? 220 : 280, max: 480 },
    answerGoal: "直接回应当前问题，并使用最相关的公开实践解释判断。",
    routeSource: "local",
  };
}

export function mergePlannedFrame(local: QuestionFrame, planned: z.infer<typeof plannedQuestionFrameSchema>, question = ""): QuestionFrame {
  const keepLocalIntent = local.confidence >= 0.82 && local.answerIntent !== "general";
  const blockCareerTransition = planned.answerIntent === "career_transition" && !hasCareerTransitionSignature(question);
  const inferredValueIntent = hasExperienceValueSignature(question) ? "experience_value" : local.answerIntent;
  const answerIntent = keepLocalIntent
    ? local.answerIntent
    : blockCareerTransition
      ? inferredValueIntent
      : planned.answerIntent;
  const plannedTopic = planned.topic === "unknown" ? local.topic : planned.topic;
  const topic = ["career_transition", "experience_value"].includes(answerIntent) ? "profile" : answerIntent === "role_fit" ? "role_fit" : plannedTopic;
  const facet = ["career_transition", "experience_value"].includes(answerIntent) ? "transfer" : answerIntent === "role_fit" ? "fit" : planned.facet;
  const targetRole = local.targetRole ?? planned.targetRole;
  const questionMode = keepLocalIntent || blockCareerTransition
    ? questionModeFor(question, answerIntent)
    : planned.questionMode;
  const conflictReason = local.answerIntent !== planned.answerIntent
    ? blockCareerTransition
      ? "missing_career_transition_signature"
      : keepLocalIntent
        ? "local_high_confidence"
        : undefined
    : undefined;
  return {
    ...local,
    topic,
    facet,
    answerIntent,
    questionMode,
    evidencePolicy: keepLocalIntent || blockCareerTransition ? evidencePolicyFor(answerIntent, questionMode) : planned.evidencePolicy,
    focusTerms: keepLocalIntent || blockCareerTransition ? focusTermsFor(answerIntent, targetRole) : planned.focusTerms,
    targetRole,
    requestedDimensions: planned.requestedDimensions,
    activeProject: planned.activeProject ?? projectForTopic(topic),
    useHistory: planned.useHistory,
    confidence: planned.confidence,
    requiredKnowledgeIds: ["career_transition", "experience_value"].includes(answerIntent) ? ["K1", "K2", "K3", "K4", "K6", "K7"] : topicKnowledge[topic],
    allowedStoryIds: facet === "example" || facet === "transfer"
      ? (topic === "atalent" ? ["ST1", "ST2"] : topic === "agent_sandbox" ? ["ST3"] : topic === "rag_eval" ? ["ST4"] : [])
      : [],
    forbiddenTopics: forbiddenFor(topic),
    responseShape: answerIntent === "career_transition" ? "narrative" : responseShapeFor(facet),
    targetLength: { min: facet === "overview" ? 220 : 280, max: 480 },
    answerGoal: "先直接回答问题，再使用最相关的公开实践说明判断、机制或迁移价值。",
    routeSource: "model",
    intentResolution: {
      localIntent: local.answerIntent,
      plannedIntent: planned.answerIntent,
      resolvedIntent: answerIntent,
      conflictReason,
    },
  };
}

export function getQuestionContract(id: string) {
  return contractById.get(id);
}

export function recommendedContractQuestions(currentContractId: string | undefined, askedQuestions: readonly string[], limit = 3) {
  const seen = new Set(askedQuestions.map(normalizeContractQuestion));
  const current = currentContractId ? contractById.get(currentContractId) : undefined;
  const preferred = (current?.nextContractIds ?? []).map((id) => contractById.get(id)).filter((item): item is QuestionContract => Boolean(item));
  const ordered = [...preferred, ...questionContracts];
  const selected: QuestionContract[] = [];
  const usedTopics = new Set<QuestionTopic>();
  for (const contract of ordered) {
    if (seen.has(normalizeContractQuestion(contract.question))) continue;
    if (selected.some((item) => item.id === contract.id)) continue;
    if (selected.length >= 1 && usedTopics.has(contract.frame.topic) && ordered.some((item) => !usedTopics.has(item.frame.topic) && !seen.has(normalizeContractQuestion(item.question)))) continue;
    selected.push(contract);
    usedTopics.add(contract.frame.topic);
    if (selected.length === limit) break;
  }
  if (selected.length < limit) {
    for (const contract of ordered) {
      if (seen.has(normalizeContractQuestion(contract.question)) || selected.some((item) => item.id === contract.id)) continue;
      selected.push(contract);
      if (selected.length === limit) break;
    }
  }
  return selected.map((contract) => contract.question);
}

export { candidateNarrative };
