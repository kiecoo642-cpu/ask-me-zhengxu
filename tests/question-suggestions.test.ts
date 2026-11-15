import assert from "node:assert/strict";
import test from "node:test";
import {
  getFollowUpQuestions,
  getHrFollowUpQuestions,
  inferQuestionCategory,
  questionGroups,
} from "../lib/question-suggestions.ts";
import { findQuestionContract } from "../lib/question-contracts.ts";

test("首屏问题按招聘关注点分组", () => {
  assert.deepEqual(questionGroups.map((group) => group.id), ["screening", "projects", "experience", "capabilities"]);
  for (const group of questionGroups) assert.equal(group.questions.length, 4);
  assert.doesNotMatch(questionGroups.flatMap((group) => group.questions).join(" "), /(^|\s)他|他的|帮助他|体现了他/);
});

test("代表项目问题优先推荐 IHG 贡献并保持话题覆盖", () => {
  const questions = getFollowUpQuestions("哪个项目最能代表他的 AI 产品能力？");
  assert.equal(inferQuestionCategory("哪个项目最能代表他的 AI 产品能力？"), "project");
  assert.match(questions[0], /IHG|aTalent|85%/);
  assert.equal(new Set(questions.map((question) => findQuestionContract(question)?.frame.topic)).size, 3);
});

test("动态追问不会重复已提问题", () => {
  const asked = ["你的主要短板和待澄清口径有哪些？", "请介绍一下你自己。"];
  const questions = getFollowUpQuestions(asked[0], asked);
  for (const question of questions) assert.equal(asked.includes(question), false);
  assert.equal(questions.length, 3);
});

test("服务端追问不足时会补足三个推荐", () => {
  const asked = ["哪个项目最能代表你的 AI 产品能力？", "你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？"];
  const preferred = ["你在 aTalent 的 IHG AI 人才匹配项目具体做了什么？"];
  const questions = getFollowUpQuestions(asked[1], asked, 3, preferred);

  assert.equal(questions.length, 3);
  for (const question of questions) assert.equal(asked.includes(question), false);
});

test("推荐问题统一使用面向候选人的第二人称视角", () => {
  const questions = getFollowUpQuestions(
    "中文帮助文档 RAG 评测有哪些关键发现和短板？",
    [],
    3,
    ["他为什么适合 AI 产品经理岗位？", "你在东华大学的教育背景和可到岗时间是什么？"],
  );

  assert.equal(questions.length, 3);
  for (const question of questions) {
    assert.equal(question.startsWith("他"), false);
    assert.doesNotMatch(question, /他的|帮助他|体现了他/);
  }
});

test("连续多轮提问后每轮仍提供三个未问追问", () => {
  const asked: string[] = ["60 秒了解郑栩。"];

  for (let round = 0; round < 8; round += 1) {
    const currentQuestion = asked.at(-1) ?? "";
    const questions = getFollowUpQuestions(currentQuestion, asked);
    assert.equal(questions.length, 3, `第 ${round + 1} 轮没有补足三个追问`);
    for (const question of questions) assert.equal(asked.includes(question), false);
    if (round < 7) asked.push(questions[0]);
  }
});

test("HR 追问固定覆盖证据、复盘和岗位匹配", () => {
  const suggestions = getHrFollowUpQuestions(
    "哪个项目最能代表你的 AI 产品能力？",
    ["哪个项目最能代表你的 AI 产品能力？"],
  );
  assert.deepEqual(suggestions.map((suggestion) => suggestion.kind), ["evidence", "retrospective", "fit"]);
  assert.deepEqual(suggestions.map((suggestion) => suggestion.label), ["证据追问", "项目复盘", "岗位匹配"]);
  assert.equal(new Set(suggestions.map((suggestion) => suggestion.question)).size, 3);
});
