import assert from "node:assert/strict";
import test from "node:test";
import { claims, knowledge, sources } from "../lib/knowledge.ts";
import { contentCatalog } from "../lib/content.ts";

test("每条知识都能定位到有效 Claim 与 Source", () => {
  const claimIds = new Set(claims.map((claim) => claim.id));
  const sourceIds = new Set(sources.map((source) => source.id));
  for (const item of knowledge) {
    assert.ok(item.claimIds.length > 0, `${item.id} 缺少 Claim`);
    assert.ok(item.sourceIds.length > 0, `${item.id} 缺少 Source`);
    for (const id of item.claimIds) assert.ok(claimIds.has(id), `${item.id} 引用未知 Claim ${id}`);
    for (const id of item.sourceIds) assert.ok(sourceIds.has(id), `${item.id} 引用未知 Source ${id}`);
  }
});

test("内容目录仅包含郑栩最新简历与确认项目事实，不含旧候选人隐私或个人联系方式", () => {
  const serialized = JSON.stringify(contentCatalog);
  const nonBoundarySerialized = JSON.stringify({
    ...contentCatalog,
    narrative: { ...contentCatalog.narrative, excludedTopics: [] },
    knowledge: contentCatalog.knowledge.filter((item) => item.id !== "K17").map((item) => ({ ...item, limitations: "" })),
    claims: contentCatalog.claims.filter((claim) => !["C20", "C26"].includes(claim.id)),
    starStories: contentCatalog.starStories.map((story) => ({ ...story, limitations: "" })),
    stableAnswers: contentCatalog.stableAnswers.map((answer) => ({
      ...answer,
      limitations: "",
      factSkeleton: {
        ...answer.factSkeleton,
        boundaryTriggers: [],
        forbiddenDetails: [],
      },
    })),
  });
  for (const forbidden of ["张倬玮", "东北大学", "容诚", "DeepFlow", "15812106204", "zackzhang124@163.com", "193-1039-1463", "3134385269@qq.com"]) {
    assert.equal(serialized.includes(forbidden), false, `不应包含旧候选人或个人隐私信息: ${forbidden}`);
  }
  for (const forbiddenExp of ["百度实习", "德勤审计"]) {
    assert.equal(nonBoundarySerialized.includes(forbiddenExp), false, `非边界条目不应包含非本人实习: ${forbiddenExp}`);
  }
  for (const required of ["郑栩", "东华大学", "信息管理与信息系统", "3.6/4.0", "10%", "aTalent", "IHG", "3,000+", "500+", "85%", "春风动力", "惠灵顿国际学校", "百川", "WebDev E2E Bench", "18 份", "Ask Me", "Jira"]) {
    assert.equal(serialized.includes(required), true, `缺少郑栩关键信息: ${required}`);
  }
});

test("IHG 85% 业务采纳率明确标注分母口径待澄清", () => {
  const ihgClaim = claims.find((claim) => claim.id === "C5");
  assert.ok(ihgClaim, "缺少 C5");
  assert.match(ihgClaim.statement, /85%/);
  assert.match(ihgClaim.limitations, /分母/);
  assert.match(ihgClaim.limitations, /待.*澄清/);
});

test("东华大学教育背景与可到岗时间准确", () => {
  const eduClaim = claims.find((claim) => claim.id === "C1");
  const availClaim = claims.find((claim) => claim.id === "C25");
  assert.ok(eduClaim);
  assert.ok(availClaim);
  assert.match(eduClaim.statement, /东华大学/);
  assert.match(eduClaim.statement, /2024(\.09)?—2028/);
  assert.match(availClaim.statement, /每周.*5 天/);
  assert.match(availClaim.statement, /6 个月/);
  assert.match(availClaim.statement, /1 周内/);
});
