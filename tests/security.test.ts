import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { assessQuestion, redactForLog } from "../lib/guardrails.ts";
import { claims, knowledge, sources } from "../lib/knowledge.ts";
import { securityCases } from "./evals/cases.ts";

function filesUnder(path: string): string[] {
  try {
    return readdirSync(path).flatMap((name) => {
      const child = join(path, name);
      return statSync(child).isDirectory() ? filesUnder(child) : [child];
    });
  } catch {
    return [];
  }
}

test("20 个隐私、机密与 Prompt Injection 用例全部拒答", () => {
  assert.equal(securityCases.length, 20);
  for (const item of securityCases) {
    assert.equal(item.expectedStatus, "refused", item.id);
    assert.equal(assessQuestion(item.question).allowed, false, item.id);
  }
});

test("联系方式与旧候选人数据不进入知识、Claim 或 Source 上下文", () => {
  const serialized = JSON.stringify({ knowledge, claims, sources });
  assert.equal(serialized.includes("15812106204"), false);
  assert.equal(serialized.includes("zackzhang124@163.com"), false);
  assert.equal(serialized.includes("张倬玮"), false);
  assert.equal(serialized.includes("东北大学"), false);
  assert.equal(serialized.includes("71.4%"), false);
  assert.equal(serialized.includes("16.04"), false);
  assert.equal(serialized.includes("69.07"), false);
  assert.equal(serialized.includes("163"), false);
});

test("日志脱敏覆盖邮箱、手机号和 API 密钥", () => {
  const testApiKey = ["sk", "abcdefghijklmnopqrstuvwx"].join("-");
  const raw = `hr@example.com 13800138000 ${testApiKey}`;
  const redacted = redactForLog(raw);
  assert.equal(redacted.includes("hr@example.com"), false);
  assert.equal(redacted.includes("13800138000"), false);
  assert.equal(redacted.includes(testApiKey), false);
});

test("应用源码与配置示例不包含疑似真实 API 密钥", () => {
  const roots = ["app", "components", "content", "lib", "scripts"];
  const files = roots.flatMap(filesUnder).concat([".env.example"]);
  const secretPattern = /\bsk-[A-Za-z0-9_-]{20,}\b/g;
  const findings = files.flatMap((file) => {
    const matches = readFileSync(file, "utf8").match(secretPattern) ?? [];
    return matches.map(() => file);
  });
  assert.deepEqual(findings, []);
});

test("公开证据包含确认的郑栩东华大学与 aTalent 经历且明确标注 85% 分母待澄清", () => {
  const serialized = JSON.stringify({ knowledge, claims, sources });
  assert.equal(serialized.includes("东华大学"), true);
  assert.equal(serialized.includes("aTalent"), true);
  assert.equal(serialized.includes("IHG"), true);
  assert.equal(serialized.includes("分母"), true);
  assert.equal(serialized.includes("待本人校核"), false);
});
