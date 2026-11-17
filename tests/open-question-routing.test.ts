import assert from "node:assert/strict";
import test from "node:test";
import { buildAnswerPlan } from "../lib/answer.ts";
import { validateAnswer } from "../lib/answer-quality.ts";
import { matchStableAnswer, retrieveKnowledge } from "../lib/knowledge.ts";
import { buildLocalQuestionFrame, findQuestionContract, mergePlannedFrame } from "../lib/question-contracts.ts";
import type { AnswerIntent } from "../lib/types.ts";

const routingCases: Array<{ question: string; intent: AnswerIntent; targetRole?: string }> = [
  { question: "为什么从信息管理转向 AI 产品？", intent: "career_transition" },
  { question: "为什么选择转向产品经理？", intent: "career_transition" },
  { question: "信管专业为什么转向 AI 产品？", intent: "career_transition" },
  { question: "为什么不继续做信息管理而改做产品经理？", intent: "career_transition" },
  { question: "你的职业规划是什么，为什么转向 AI 产品？", intent: "career_transition" },
  { question: "为什么从信管专业转向产品？", intent: "career_transition" },
  { question: "为何选择转向 AI 产品经理？", intent: "career_transition" },
  { question: "你是怎么从信管走到 AI 产品方向的？", intent: "career_transition" },
  { question: "为什么转向 AI 产品方向？", intent: "career_transition" },
  { question: "信管专业背景为什么进入 AI 产品方向？", intent: "career_transition" },

  { question: "你和商业化产品经理这个岗有什么匹配之处？", intent: "role_fit", targetRole: "商业化产品经理" },
  { question: "你与搜索产品经理岗位有哪些契合点？", intent: "role_fit", targetRole: "搜索产品经理" },
  { question: "你为什么适合增长产品经理？", intent: "role_fit", targetRole: "增长产品经理" },
  { question: "你能胜任数据产品经理吗？", intent: "role_fit", targetRole: "数据产品经理" },
  { question: "你和企业服务产品经理的匹配度如何？", intent: "role_fit", targetRole: "企业服务产品经理" },
  { question: "你与广告产品经理相比有哪些匹配证据？", intent: "role_fit", targetRole: "广告产品经理" },
  { question: "你为什么契合策略产品经理岗位？", intent: "role_fit", targetRole: "策略产品经理" },
  { question: "你和平台产品经理这个岗位匹配吗？", intent: "role_fit", targetRole: "平台产品经理" },
  { question: "你适合 B 端产品经理岗位吗？", intent: "role_fit", targetRole: "B 端产品经理" },
  { question: "你与内容产品经理有什么匹配点？", intent: "role_fit", targetRole: "内容产品经理" },
  { question: "你能为推荐产品经理岗位带来什么？", intent: "role_fit", targetRole: "推荐产品经理" },
  { question: "你为什么能胜任风控产品经理？", intent: "role_fit", targetRole: "风控产品经理" },
  { question: "你和支付产品经理岗位的契合之处是什么？", intent: "role_fit", targetRole: "支付产品经理" },
  { question: "你与 Agent 产品经理岗位有什么关系？", intent: "role_fit", targetRole: "Agent 产品经理" },
  { question: "如果应聘 AI 应用产品经理，你的岗位优势是什么？", intent: "role_fit", targetRole: "AI 应用产品经理" },

  { question: "你有经过验证的商业化结果吗？", intent: "result" },
  { question: "你做过商业化项目吗？", intent: "result" },
  { question: "目前有没有可以说明的营收数据？", intent: "result" },
  { question: "你负责过用户增长结果吗？", intent: "result" },
  { question: "项目形成真实用户规模了吗？", intent: "result" },
  { question: "这些项目已经生产上线了吗？", intent: "result" },
  { question: "有没有经过验证的留存和转化数据？", intent: "result" },
  { question: "你的原型取得了什么量化成果？", intent: "result" },

  { question: "你的过往经历对你做 AI 产品有什么帮助？", intent: "experience_value" },
  { question: "信息管理专业如何支持产品决策？", intent: "experience_value" },
  { question: "你之前的经历对你求职 AI 有什么帮助？", intent: "experience_value" },
  { question: "如果把 RAG 方法迁移到内部知识管理，你会先看什么？", intent: "diagnosis" },
  { question: "你过往经历对你做 AI 产品有什么价值？", intent: "experience_value" },

  { question: "RAG 项目最难的取舍是什么？", intent: "challenge" },
  { question: "讲一个你推进项目时遇到的困难。", intent: "challenge" },
  { question: "如果项目失败，你会如何复盘？", intent: "challenge" },
  { question: "模型效果没有改善时你先排查什么？", intent: "diagnosis" },
  { question: "如何定位检索和生成之间的问题？", intent: "diagnosis" },
  { question: "同一批 Bad Case 仍然失败，你会怎么处理？", intent: "challenge" },

  { question: "为什么要转向 AI 产品？", intent: "career_transition" },
  { question: "为什么选择 AI 产品方向？", intent: "career_transition" },
  { question: "信管专业和产品经理方向有什么连续性？", intent: "career_transition" },
  { question: "你是如何确认自己适合做产品的？", intent: "role_fit" },
  { question: "从信息管理到 AI 产品，你做了哪些准备？", intent: "career_transition" },
  { question: "你为什么想转向 AI 应用产品？", intent: "career_transition" },

  { question: "你和商业分析产品经理岗位有什么匹配之处？", intent: "role_fit", targetRole: "商业分析产品经理" },
  { question: "你与 AI 平台产品经理岗位如何匹配？", intent: "role_fit", targetRole: "AI 平台产品经理" },
  { question: "你和企业 AI 产品经理的匹配点是什么？", intent: "role_fit", targetRole: "企业 AI 产品经理" },
  { question: "你能为智能客服产品经理岗位带来什么？", intent: "role_fit", targetRole: "智能客服产品经理" },
  { question: "你为什么适合做数据分析产品？", intent: "role_fit", targetRole: "数据分析产品" },
  { question: "你与商业分析岗位有哪些可迁移能力？", intent: "role_fit", targetRole: "商业分析岗位" },

  { question: "你有真实的收入或付费转化结果吗？", intent: "result" },
  { question: "目前项目有没有可公开的用户数据？", intent: "result" },
  { question: "你做过正式上线并持续运营的产品吗？", intent: "result" },
  { question: "项目的留存、转化或规模结果如何？", intent: "result" },

  { question: "你的信管专业训练如何帮助你做产品判断？", intent: "experience_value" },
  { question: "信管专业训练如何帮助你做需求判断？", intent: "experience_value" },
  { question: "你的信管专业对 AI 产品有什么价值？", intent: "experience_value" },
  { question: "你的过往经历对企业服务产品有什么价值？", intent: "experience_value" },

  { question: "如果产品上线后核心指标没有达到预期，你会怎么办？", intent: "diagnosis" },
  { question: "假设需求方和研发对方案有分歧，你会怎么推进？", intent: "challenge" },
  { question: "如果只能保留一个功能，你会如何取舍？", intent: "challenge" },
  { question: "你怎么看待 AI 产品中的人工确认环节？", intent: "general" },
  { question: "如果没有足够数据验证方案，你会如何决策？", intent: "diagnosis" },
  { question: "你会如何判断一个 AI 功能是否值得做？", intent: "general" },
  { question: "如果模型效果和用户体验发生冲突，你会怎么处理？", intent: "diagnosis" },
  { question: "你如何理解产品经理在跨团队协作中的作用？", intent: "general" },

  { question: "你不能回答开放问题吗？", intent: "capability_scope" },
  { question: "你能回答哪些开放题？", intent: "capability_scope" },
  { question: "这个 Agent 能不能回答没有标准答案的问题？", intent: "capability_scope" },
  { question: "你有什么作用？", intent: "capability_scope" },
  { question: "你可以干什么？", intent: "capability_scope" },
  { question: "你之前的经历都对你求职 AI 有什么帮助？", intent: "experience_value" },
  { question: "你过往经历对做产品有什么帮助？", intent: "experience_value" },
  { question: "你的专业对你做 AI 产品有什么帮助", intent: "experience_value" },
  { question: "你的专业背景对 AI 产品有什么价值", intent: "experience_value" },
  { question: "你所学专业如何支持产品判断", intent: "experience_value" },
  { question: "如果面试官问到陌生业务，你会怎么快速理解？", intent: "diagnosis" },
  { question: "你平时如何面对压力和不确定性？", intent: "general" },
];

test("75 个未预写开放问题按提问动作稳定路由", () => {
  assert.ok(routingCases.length >= 75);
  for (const fixture of routingCases) {
    const frame = buildLocalQuestionFrame(fixture.question);
    assert.equal(frame.answerIntent, fixture.intent, fixture.question);
    if (fixture.targetRole) assert.equal(frame.targetRole, fixture.targetRole, fixture.question);
  }
});

test("本地高置信度动作不被模型规划器覆盖", () => {
  const challenge = buildLocalQuestionFrame("请你讲一个项目中的真实挑战或失败，并说明如何定位、调整和验证。");
  assert.equal(challenge.answerIntent, "challenge");
  assert.ok(challenge.confidence >= 0.82);

  const merged = mergePlannedFrame(challenge, {
    topic: "profile",
    facet: "transfer",
    answerIntent: "career_transition",
    questionMode: "candidate_fact",
    evidencePolicy: "required",
    focusTerms: ["职业转型动机"],
    requestedDimensions: ["选择原因"],
    useHistory: false,
    confidence: 0.95,
  });
  assert.equal(merged.answerIntent, "challenge");
});

test("没有转型动作的问题不会被模型规划器覆盖为职业转型", () => {
  const question = "你的专业对你做 AI 产品有什么帮助";
  const local = buildLocalQuestionFrame(question);
  const merged = mergePlannedFrame(local, {
    topic: "profile",
    facet: "transfer",
    answerIntent: "career_transition",
    questionMode: "candidate_fact",
    evidencePolicy: "required",
    focusTerms: ["转型动机"],
    requestedDimensions: ["选择原因"],
    useHistory: false,
    confidence: 0.96,
  }, question);

  assert.equal(local.answerIntent, "experience_value");
  assert.equal(merged.answerIntent, "experience_value");
  assert.equal(merged.intentResolution?.conflictReason, "missing_career_transition_signature");
});

test("明确出现转向动作时仍保持职业转型意图", () => {
  for (const question of ["信息管理专业为什么转向 AI 产品", "为什么选择转向 AI 产品经理"]) {
    assert.equal(buildLocalQuestionFrame(question).answerIntent, "career_transition", question);
  }
});

test("包含上线字样的假设排查题优先识别为方法题", () => {
  const frame = buildLocalQuestionFrame("如果一个 AI 产品上线后用户反馈效果不好，你会怎么排查？");
  assert.equal(frame.answerIntent, "diagnosis");
  assert.equal(frame.questionMode, "candidate_reasoning");
  assert.ok(frame.confidence >= 0.82);
});

test("简历核心事实题使用精确契约且不误判为 Agent 能力", () => {
  assert.equal(findQuestionContract("你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？")?.id, "A04");
  assert.equal(findQuestionContract("你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？")?.id, "A07");
  assert.equal(findQuestionContract("模型选型是怎么做出来的？")?.id, "A11");
  assert.equal(findQuestionContract("你在百川智能的医疗 RAG 项目具体做了什么？")?.id, "A14");
  assert.equal(findQuestionContract("Claude Jira 提单工具是怎么提效的？")?.id, "A25");
});

test("转型与新岗位问题均生成非空、相关且事实安全的面试回答", () => {
  for (const fixture of routingCases.filter((item) => ["career_transition", "role_fit"].includes(item.intent))) {
    const frame = buildLocalQuestionFrame(fixture.question);
    const stable = matchStableAnswer(fixture.question, [], frame);
    const items = retrieveKnowledge(fixture.question, { frame, limit: 4 });
    const plan = buildAnswerPlan(fixture.question, items, stable, [], frame);
    assert.ok(plan.fallbackAnswer.trim().length > 120, fixture.question);
    assert.equal(validateAnswer(plan.fallbackAnswer, plan).passed, true, `${fixture.question}: ${validateAnswer(plan.fallbackAnswer, plan).triggers.join(", ")}`);
  }
});
