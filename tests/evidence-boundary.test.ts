import assert from "node:assert/strict";
import test from "node:test";
import { buildContext } from "../lib/answer.ts";
import { claims, knowledge, matchStableAnswer, serializeKnowledgeItems, sources } from "../lib/knowledge.ts";

test("IHG 85% 业务采纳率口径显式标明分母待澄清", () => {
  const answer = matchStableAnswer("为什么说 IHG 85% 业务采纳率的分母口径待澄清？");
  const ihg = knowledge.find((item) => item.id === "K4");
  const source = sources.find((item) => item.id === "S2");
  const claim5 = claims.find((item) => item.id === "C5");
  assert.ok(answer && ihg && source && claim5);
  assert.match(answer.standardAnswer, /85%/);
  assert.match(answer.standardAnswer, /分母|口径/);
  assert.match(claim5.statement, /分母口径待.*澄清/);
  assert.equal(ihg.projectStatus, "completed");
  assert.equal(source.projectStatus, "completed");
});

test("IHG RAG 回答区分 5 轮 30 条内部 QA 与非客户验收边界", () => {
  const answer = matchStableAnswer("你在 aTalent 的 IHG 人才库 RAG 问答助手具体做了什么？");
  const rag = knowledge.find((item) => item.id === "K5");
  const source = sources.find((item) => item.id === "S2");
  assert.ok(answer && rag && source);
  assert.match(answer.standardAnswer, /5 轮|30 条/);
  assert.match(answer.standardAnswer, /Rerank|Redis/);
  assert.match(answer.standardAnswer, /多跳|内部 QA/);
  assert.equal(rag.projectStatus, "completed");
  assert.equal(source.projectStatus, "completed");
});

test("模型上下文只提供自然事实材料，不暴露内部证据标签", () => {
  const context = buildContext(knowledge.filter((item) => ["K1", "K4", "K14"].includes(item.id)));
  assert.match(context, /主题：/);
  assert.match(context, /东华大学/);
  assert.doesNotMatch(context, /Claim ID|Source ID|验证状态|\[C\d+\]/);
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
