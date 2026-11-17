import assert from "node:assert/strict";
import test from "node:test";
import { capabilityNavigation } from "../lib/capability-navigation";
import { retrieveKnowledge } from "../lib/knowledge";

test("侧栏能力索引提供三组招聘方可理解的能力证据", () => {
  assert.equal(capabilityNavigation.length, 3);
  assert.equal(new Set(capabilityNavigation.map(({ title }) => title)).size, 3);
  assert.equal(new Set(capabilityNavigation.map(({ question }) => question)).size, 3);

  for (const capability of capabilityNavigation) {
    assert.ok(capability.items.length >= 3);
    assert.ok(capability.summary.length > 10);
    assert.ok(retrieveKnowledge(capability.question).length > 0, capability.question);
  }
});

test("评测与原型能力只使用现有材料可支持的表述", () => {
  const evalPillar = capabilityNavigation.find(({ title }) => title.includes("端到端评测"));
  assert.ok(evalPillar);

  const evidence = evalPillar.items.join(" ");
  assert.match(evidence, /百川/);
  assert.match(evidence, /WebDev|盲评/);
  assert.match(evidence, /16\.04|69\.07/);
  assert.doesNotMatch(evidence, /DeepFlow|56%|88%/);
});
