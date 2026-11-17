import assert from "node:assert/strict";
import test from "node:test";
import { buildAnswerPlan } from "../lib/answer.ts";
import { answerSimilarity, validateAnswer } from "../lib/answer-quality.ts";
import { retrieveKnowledge } from "../lib/knowledge.ts";
import {
  buildLocalQuestionFrame,
  findQuestionContract,
  frameFromContract,
  questionContracts,
} from "../lib/question-contracts.ts";
import { getFollowUpQuestions, recommendationQuestionCandidates } from "../lib/question-suggestions.ts";

const zhengXuCases = [
  { question: "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？", contractId: "A04", topic: "atalent", facet: "contribution", requiredIds: ["K4", "K13", "K14"], forbidden: /东北大学|DeepFlow|德勤/ },
  { question: "为什么说 IHG 85% 业务采纳率的分母口径待澄清？", contractId: "A05", topic: "atalent", facet: "boundary", requiredIds: ["K4", "K13", "K14"], forbidden: /东北大学|DeepFlow/ },
  { question: "你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？", contractId: "A07", topic: "rag", facet: "contribution", requiredIds: ["K5", "K7", "K14"], forbidden: /东北大学|DeepFlow/ },
  { question: "模型选型是怎么做出来的？", contractId: "A11", topic: "model_selection", facet: "method", requiredIds: ["K6", "K14"], forbidden: /东北大学|DeepFlow/ },
  { question: "你在百川智能的医疗 RAG 项目具体做了什么？", contractId: "A14", topic: "baichuan_rag", facet: "contribution", requiredIds: ["K7", "K14"], forbidden: /东北大学|DeepFlow/ },
  { question: "Claude Jira 提单工具是怎么提效的？", contractId: "A25", topic: "jira_tool", facet: "method", requiredIds: ["K12", "K14"], forbidden: /东北大学|DeepFlow/ },
  { question: "你在东华大学的教育背景和可到岗时间是什么？", contractId: "A27", topic: "education", facet: "overview", requiredIds: ["K3", "K1"], forbidden: /东北大学|DeepFlow/ },
  { question: "Ask-Me 是怎么保证不编造事实的？", contractId: "A20", topic: "ask_me", facet: "method", requiredIds: ["K9", "K14"], forbidden: /东北大学|DeepFlow/ },
] as const;

test("推荐候选全部拥有可执行的问题契约", () => {
  const uncovered = recommendationQuestionCandidates.filter((question) => !findQuestionContract(question));
  assert.deepEqual(uncovered, []);
});

test("核心深层对话问题按主题和维度定向检索", () => {
  for (const fixture of zhengXuCases) {
    const contract = findQuestionContract(fixture.question);
    assert.equal(contract?.id, fixture.contractId);
    assert.equal(contract?.frame.topic, fixture.topic);
    assert.equal(contract?.frame.facet, fixture.facet);
    const frame = frameFromContract(contract!);
    const items = retrieveKnowledge(fixture.question, { frame, limit: 4 });
    assert.deepEqual(items.map((item) => item.id), [...fixture.requiredIds]);
  }
});

test("核心专属兜底直接回答且不泄漏无关主题", () => {
  for (const fixture of zhengXuCases) {
    const contract = findQuestionContract(fixture.question)!;
    const frame = frameFromContract(contract);
    const items = retrieveKnowledge(fixture.question, { frame, limit: 4 });
    const plan = buildAnswerPlan(fixture.question, items, undefined, [], frame, contract);
    assert.doesNotMatch(plan.fallbackAnswer, fixture.forbidden);
    assert.doesNotMatch(plan.fallbackAnswer, /进一步判断|实践依据|落地方式|我提供并确认|我提供并授权/);
    assert.equal(validateAnswer(plan.fallbackAnswer, plan).passed, true, `${fixture.contractId}: ${validateAnswer(plan.fallbackAnswer, plan).triggers.join(", ")}`);
  }
});

test("长尾问题通过本地 Frame 限定主题，未知题保留规划入口", () => {
  const routed = buildLocalQuestionFrame("RAG 的引用质量出了问题时，你会先检查哪里？");
  assert.equal(routed.topic, "rag");
  assert.equal(routed.facet, "evaluation");
  assert.equal(routed.confidence >= 0.8, true);

  const unknown = buildLocalQuestionFrame("如果资源突然减半，你会怎么排优先级？");
  assert.equal(unknown.confidence >= 0.8, true);
  assert.equal(unknown.questionMode, "candidate_reasoning");
  assert.equal(unknown.routeSource, "local");
});

test("第 4 至 8 轮推荐仍由契约驱动并保持回答差异", () => {
  const asked: string[] = [];
  const answers: string[] = [];
  let current = "60 秒了解郑栩。";
  for (let turn = 0; turn < 8; turn += 1) {
    const contract = findQuestionContract(current)!;
    const frame = frameFromContract(contract);
    const items = retrieveKnowledge(current, { frame, limit: 4 });
    const history = answers.flatMap((answer, index) => ([
      { role: "user" as const, content: asked[index] },
      { role: "assistant" as const, content: answer },
    ]));
    const plan = buildAnswerPlan(current, items, undefined, history, frame, contract);
    if (answers.length) assert.equal(answerSimilarity(plan.fallbackAnswer, answers.at(-1)!) < 0.62, true);
    asked.push(current);
    answers.push(plan.fallbackAnswer);
    const recommendations = getFollowUpQuestions(current, asked, 3);
    assert.equal(recommendations.length, 3);
    recommendations.forEach((question) => assert.ok(findQuestionContract(question)));
    current = recommendations[0];
  }
});

test("所有契约的稳定兜底均通过相关性与事实门禁", () => {
  const failures = questionContracts.flatMap((contract) => {
    const frame = frameFromContract(contract);
    const items = retrieveKnowledge(contract.question, { frame, limit: 4 });
    const plan = buildAnswerPlan(contract.question, items, undefined, [], frame, contract);
    const result = validateAnswer(plan.fallbackAnswer, plan);
    return result.passed ? [] : [`${contract.id}: ${result.triggers.join(", ")}`];
  });
  assert.deepEqual(failures, []);
});
