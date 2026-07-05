// 決定的ルールマッチャー。
// 設計原則(DESIGN-DOC): 発火は R1/R2 の2ルールのみ = 偽陽性ゼロ。LLMは照合に使わない。
export function createMatcher(rules, { onFire }) {
  const fired = new Set(); // 同一ルールの連続発火を防ぐ(リセット可能)

  function evaluate(event) {
    // event: { parameter: 'thickness'|'fillet', value, prev }
    for (const rule of rules) {
      if (fired.has(rule.id)) continue;
      const t = rule.trigger;
      if (t.parameter !== event.parameter) continue;

      let hit = false;
      if (t.op === 'lt') hit = event.value < t.value;
      if (t.op === 'change') hit = event.prev === t.from && event.value === t.to;

      if (hit) {
        fired.add(rule.id);
        onFire(rule, event);
        return rule;
      }
    }
    return null;
  }

  function reset(ruleId) {
    if (ruleId) fired.delete(ruleId);
    else fired.clear();
  }

  return { evaluate, reset };
}
