import assert from "node:assert/strict";
import test from "node:test";
import { buildContext } from "../lib/answer.ts";
import { claims, knowledge, matchStableAnswer, serializeKnowledgeItems, sources } from "../lib/knowledge.ts";

test("IHG 85% 业务采纳率口径显式标明分母待澄清", () => {
  const answer = matchStableAnswer("为什么说 IHG 85% 业务采纳率的分母口径待澄清？");
  const ihg = knowledge.find((item) => item.id === "K5");
  const source = sources.find((item) => item.id === "S2");
  const claim5 = claims.find((item) => item.id === "C5");
  assert.ok(answer && ihg && source && claim5);
  assert.match(answer.standardAnswer, /85%/);
  assert.match(answer.standardAnswer, /分母|口径/);
  assert.match(claim5.statement, /分母口径待.*澄清/);
  assert.equal(ihg.projectStatus, "completed");
  assert.equal(source.projectStatus, "completed");
});

test("RAG 评测回答区分 9 组实验结果与口语化短板边界", () => {
  const answer = matchStableAnswer("中文帮助文档 RAG 评测有哪些关键发现和短板？");
  const rag = knowledge.find((item) => item.id === "K7");
  const source = sources.find((item) => item.id === "S4");
  assert.ok(answer && rag && source);
  assert.match(answer.standardAnswer, /45 篇|30 条/);
  assert.match(answer.standardAnswer, /Recall@5.*1\.000|1\.000/);
  assert.match(answer.standardAnswer, /口语化提问/);
  assert.equal(rag.projectStatus, "completed");
  assert.equal(source.projectStatus, "completed");
});

test("模型上下文只提供自然事实材料，不暴露内部证据标签", () => {
  const context = buildContext(knowledge.filter((item) => ["K1", "K4", "K11"].includes(item.id)));
  assert.match(context, /主题：/);
  assert.match(context, /东华大学/);
  assert.doesNotMatch(context, /Claim|Source|验证状态|\[C\d+\]/);
  assert.equal(claims.some((claim) => claim.evidenceBasis === "inference" && claim.claimType !== "boundary"), false);
});

test("API 序列化不向浏览器暴露 Obsidian 审核溯源", () => {
  const item = knowledge.find((entry) => entry.id === "K4");
  assert.ok(item);
  const serialized = serializeKnowledgeItems([{
    ...item,
    provenance: {
      provider: "obsidian",
      candidateId: "obs_0123456789abcdef",
      sourceSha256: "a".repeat(64),
      section: "当前状态边界",
      reviewedAt: "2026-07-16",
    },
  }]);
  assert.equal("provenance" in serialized[0], false);
});
