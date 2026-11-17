import assert from "node:assert/strict";
import test from "node:test";
import { buildAnswerPlan } from "../lib/answer.ts";
import { decideAnswerability } from "../lib/answerability.ts";
import { matchStableAnswer, retrieveKnowledge } from "../lib/knowledge.ts";
import { buildLocalQuestionFrame, findQuestionContract } from "../lib/question-contracts.ts";
import type { ChatMessage } from "../lib/types.ts";

function dispositionFor(question: string, history: ChatMessage[] = []) {
  const contract = findQuestionContract(question);
  const frame = buildLocalQuestionFrame(question, history);
  const items = retrieveKnowledge(question, { history, limit: 4, frame });
  const stableAnswer = matchStableAnswer(question, history, frame);
  const plan = buildAnswerPlan(question, items, stableAnswer, history, frame, contract);
  return decideAnswerability({
    question,
    history,
    frame,
    plan,
    items,
    claimIds: stableAnswer ? [...stableAnswer.requiredClaimIds] : [...new Set(items.flatMap((item) => item.claimIds))],
    sourceIds: stableAnswer ? [...stableAnswer.requiredSourceIds] : [...new Set(items.flatMap((item) => item.sourceIds))],
    stableAnswer,
    contract,
  });
}

const factualQuestions = [
  "请介绍一下你自己。",
  "哪个项目最能代表你的 AI 产品能力？",
  "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？",
  "为什么说 IHG 85% 业务采纳率的分母口径待澄清？",
  "你在 aTalent 还服务过哪些其他客户？",
  "你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？",
  "模型选型是怎么做出来的？",
  "你在百川智能的医疗 RAG 项目具体做了什么？",
  "Claude Jira 提单工具是怎么提效的？",
  "你在东华大学的教育背景和可到岗时间是什么？",
  "Ask-Me 是怎么保证不编造事实的？",
  "你掌握哪些产品原型与协作工具？",
];

const reasoningQuestions = [
  "如果 Agent 评测结果波动很大，你会怎么排查？",
  "如果 Agent 回归测试一直没有改善，你会如何处理？",
  "假设 RAG 召回很多无关文档，你会怎么定位？",
  "如果一个 AI 产品需求很模糊，你会怎么拆解？",
  "假设 RAG 引用准确率突然下降，你会如何分析？",
  "如果产品指标很多，你会怎么确定优先级？",
  "如果企业客户担心权限风险，你会如何设计方案？",
  "假设 Agent 经常执行跑偏，你会怎么验证？",
  "如果生成式 UI 原型测试效果不好，你下一步怎么做？",
  "如果 Agent 沙箱上线前发现核心流程失败，你会如何决策？",
  "如果评测集和线上反馈冲突，你会如何判断？",
  "假设企业知识库权限复杂，你会怎么拆解方案？",
  "如果 Agent 任务链过长导致失败，你会怎么取舍？",
];

const clarificationQuestions = [
  "你和这个岗有什么匹配之处？",
  "你为什么适合该岗位？",
  "你对上述职位有什么理解？",
  "你加入这个岗位后会先做什么？",
  "你在这个项目里具体做了什么？",
  "该项目现在有什么结果？",
  "上述项目最难的取舍是什么？",
  "前面提到的项目如何评测？",
  "这个职位最看重哪项能力？",
  "该系统的目标用户是谁？",
];

const unsupportedQuestions = [
  "你最喜欢哪支球队？",
  "你的星座是什么？",
  "你父母从事什么工作？",
  "你平时住在哪里？",
  "你的期望薪资具体是多少？",
  "你有没有负责过千万营收？",
  "你带过多少人的正式团队？",
  "你是否独立训练过千亿参数模型？",
  "你做过自动驾驶感知算法吗？",
  "你能详细设计一座跨海大桥吗？",
  "你是否负责过海外支付牌照申请？",
  "你最支持哪位政治人物？",
  "你是否拿到过亿元融资？",
  "你有没有负责过百万付费用户？",
  "你能说自己已经带领正式研发团队吗？",
];

test("严格边界回归集覆盖不少于 50 道事实、方法、澄清和拒答问题", () => {
  assert.ok(factualQuestions.length + reasoningQuestions.length + clarificationQuestions.length + unsupportedQuestions.length >= 50);

  for (const question of factualQuestions) {
    assert.equal(dispositionFor(question).disposition, "answer", question);
  }
  for (const question of reasoningQuestions) {
    assert.equal(dispositionFor(question).disposition, "scoped_answer", question);
  }
  for (const question of clarificationQuestions) {
    assert.equal(dispositionFor(question).disposition, "clarify", question);
  }
  for (const question of unsupportedQuestions) {
    assert.equal(dispositionFor(question).disposition, "decline", question);
  }
});

test("岗位和项目指代在历史明确后不再错误澄清", () => {
  const roleHistory: ChatMessage[] = [
    { role: "user", content: "我想了解 AI 产品经理岗位。" },
    { role: "assistant", content: "可以继续问岗位匹配。" },
  ];
  assert.equal(buildLocalQuestionFrame("你和这个岗有什么匹配之处？", roleHistory).targetRole, "AI 产品经理");
  assert.notEqual(dispositionFor("你和这个岗有什么匹配之处？", roleHistory).disposition, "clarify");

  const projectHistory: ChatMessage[] = [
    { role: "user", content: "介绍一下中文帮助文档 RAG 评测项目。" },
    { role: "assistant", content: "我介绍了 45 篇文档、30 条评测集和 9 组对照实验。" },
  ];
  assert.notEqual(dispositionFor("你在这个项目里具体做了什么？", projectHistory).disposition, "clarify");
});

test("候选人回答中偶然出现的岗位名不会替面试官补全指代", () => {
  const assistantOnlyHistory: ChatMessage[] = [
    { role: "user", content: "请介绍一下你自己。" },
    { role: "assistant", content: "我的求职方向是 AI 产品经理。" },
  ];
  assert.equal(dispositionFor("你和这个岗位有什么匹配之处？", assistantOnlyHistory).disposition, "clarify");
});
