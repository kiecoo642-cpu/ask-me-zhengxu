import assert from "node:assert/strict";
import test from "node:test";
import { buildAnswerPlan, buildContext } from "../lib/answer.ts";
import { retrieveKnowledge } from "../lib/knowledge.ts";

test("多轮面试上下文显式记录当前项目、已问维度与已用证据", () => {
  const history = [
    { role: "user" as const, content: "介绍一下你的 RAG 项目。" },
    { role: "assistant" as const, content: "中文帮助文档 RAG 评测覆盖 45 篇文档与 30 条带证据句评测集，对比 9 组配置。" },
  ];
  const items = retrieveKnowledge("这个项目中你具体负责了什么？", { history });
  const plan = buildAnswerPlan("这个项目中你具体负责了什么？", items, undefined, history);

  assert.equal(plan.conversationContext.activeProject, "rag-retrieval-eval");
  assert.equal(plan.conversationContext.depth, "follow_up");
  assert.ok(plan.conversationContext.askedDimensions.includes("overview"));
  assert.ok(plan.brief.primaryEvidenceId);
  assert.ok(plan.brief.supportingEvidenceIds.length <= 2);
});

test("深度开放题模型上下文聚焦一项主证据和最多两项互补证据", () => {
  const question = "你之前的经历对你求职 AI 产品有什么帮助？";
  const items = retrieveKnowledge(question, { limit: 4 });
  const plan = buildAnswerPlan(question, items);
  const context = buildContext(items, plan);

  assert.equal((context.match(/<material>/g) ?? []).length <= 3, true);
  assert.ok(plan.brief.primaryEvidenceId);
  assert.equal(plan.detailLevel, "deep");
  assert.equal(plan.brief.newInformationGoal.length > 0, true);
  assert.match(context, /优先讲主证据/);
});

test("回答厚度根据题型自适应而不是统一拉长", () => {
  const conciseQuestions = [
    "你是谁？", "你能做什么？", "你可以干什么？", "你有什么作用？",
    "你的学历是什么？", "你如何保护隐私？", "你能回答哪些问题？",
  ];
  const standardQuestions = [
    "介绍一下 RAG 项目。", "你如何使用 AI 编程工具？",
    "Claude Jira 工单工具是如何提效的？", "你掌握哪些产品原型与协作工具？",
  ];
  const deepQuestions = [
    "你为什么适合 AI 产品经理岗位？", "哪个项目最能代表你的 AI 产品能力？",
    "你的专业对你做 AI 产品有什么帮助？", "你在 aTalent 实习中具体负责什么？",
    "项目中最大的挑战是什么？",
  ];

  for (const question of conciseQuestions) {
    assert.equal(buildAnswerPlan(question, retrieveKnowledge(question)).detailLevel, "concise", question);
  }
  for (const question of standardQuestions) {
    assert.equal(buildAnswerPlan(question, retrieveKnowledge(question)).detailLevel, "standard", question);
  }
  for (const question of deepQuestions) {
    assert.equal(buildAnswerPlan(question, retrieveKnowledge(question)).detailLevel, "deep", question);
  }
});

test("深层追问只补充新信息，不因轮次增加而机械扩写", () => {
  const history = [
    { role: "user" as const, content: "介绍一下你的 RAG 检索与引用评测项目。" },
    { role: "assistant" as const, content: "我介绍了 45 篇中文文档、30 条评测集和 9 组实验配置。" },
    { role: "user" as const, content: "你具体负责什么？" },
    { role: "assistant" as const, content: "我介绍了分块与检索路线拆解、检索与引用分离评估。" },
    { role: "user" as const, content: "最大的取舍是什么？" },
    { role: "assistant" as const, content: "我介绍了整篇文档切分和固定 120 字切分在引用准确率上的差异。" },
  ];
  const question = "如果口语化提问还是没有改善，你下一步先看什么？";
  const plan = buildAnswerPlan(question, retrieveKnowledge(question, { history }), undefined, history);

  assert.equal(plan.conversationContext.depth, "deep_dive");
  assert.equal(plan.targetLength.max <= 500, true);
  assert.equal(plan.newInformationGoal.length > 0, true);
});
