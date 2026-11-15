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

test("内容目录仅包含郑栩简历 v4 真实事实，不含旧候选人数字或个人联系方式", () => {
  const serialized = JSON.stringify(contentCatalog);
  for (const forbidden of ["张倬玮", "东北大学", "百川", "百度", "德勤", "容诚", "DeepFlow", "71.4%", "16.04", "69.07", "163", "15812106204", "zackzhang124@163.com"]) {
    assert.equal(serialized.includes(forbidden), false, `不应包含旧候选人信息: ${forbidden}`);
  }
  for (const required of ["郑栩", "东华大学", "信息管理与信息系统", "3.3/4.0", "10%", "aTalent", "IHG", "3000+", "500+", "85%", "春风动力", "惠灵顿国际学校", "56%", "88%", "Recall@5", "1.000", "0.983", "0.967", "0.867", "Jira"]) {
    assert.equal(serialized.includes(required), true, `缺少郑栩关键信息: ${required}`);
  }
});

test("IHG 85% 业务采纳率明确标注分母口径待澄清", () => {
  const ihgClaim = claims.find((claim) => claim.id === "C5");
  assert.ok(ihgClaim, "缺少 C5");
  assert.match(ihgClaim.statement, /85%/);
  assert.match(ihgClaim.limitations, /分母/);
  assert.match(ihgClaim.limitations, /待澄清/);
});

test("东华大学教育背景与可到岗时间准确", () => {
  const eduClaim = claims.find((claim) => claim.id === "C1");
  const availClaim = claims.find((claim) => claim.id === "C19");
  assert.ok(eduClaim);
  assert.ok(availClaim);
  assert.match(eduClaim.statement, /东华大学/);
  assert.match(eduClaim.statement, /2024—2028/);
  assert.match(availClaim.statement, /每周 5 天/);
  assert.match(availClaim.statement, /6 个月/);
  assert.match(availClaim.statement, /1 周内/);
});
