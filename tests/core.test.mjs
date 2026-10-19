import test from 'node:test';
import assert from 'node:assert/strict';
import { needs, methods, validEnergy, makePlan, rankMethods, evaluateRecovery, pacing, remainingSeconds } from '../skills/rest/assets/app/core.js';

test('unassessed is distinct from zero and rejects invalid input', () => {
  for (const value of [null, undefined, '', '5', NaN, -1, 11, 2.5]) {
    assert.equal(validEnergy(value), false);
    assert.throws(() => makePlan(value, []));
  }
  assert.equal(makePlan(0, []).energy, 0);
  assert.throws(() => makePlan(5, ['missing']));
  assert.throws(() => makePlan(5, ['body', 'body']));
  assert.throws(() => makePlan(5, [], 'missing'));
});
test('all 2,816 energy / needs / mode combinations produce consistent bounded plans', () => {
  let cases = 0;
  for (let energy = 0; energy <= 10; energy++) {
    for (let bits = 0; bits < 32; bits++) {
      const selected = needs.filter((_, i) => bits & (1 << i)).map(n => n.id);
      for (const manual of [null, ...methods.map(m => m.id)]) {
        const p = makePlan(energy, selected, manual);
        assert.ok(p.steps.length >= 2 && p.steps.length <= 3);
        assert.ok(p.steps.every(s => Number.isInteger(s.minutes) && s.minutes > 0));
        assert.equal(p.total, p.steps.reduce((s, x) => s + x.minutes, 0));
        assert.equal(p.primary, manual || rankMethods(energy, selected)[0].id);
        assert.deepEqual(p, makePlan(energy, selected, manual));
        assert.equal(makePlan(energy, [...selected].reverse(), manual).primary, p.primary);
        assert.deepEqual(selected, p.needs);
        assert.notEqual(selected, p.needs);
        if (energy <= 3) assert.equal(p.steps.length, 2);
        cases++;
      }
    }
  }
  assert.equal(cases, 2816);
});
test('a need changes recommendations, manual choice wins, low energy prioritizes rest', () => {
  assert.equal(rankMethods(6, ['body'])[0].id, 'physical');
  assert.equal(rankMethods(6, ['mind'])[0].id, 'mental');
  assert.equal(rankMethods(6, ['emotion'])[0].id, 'emotional');
  assert.equal(rankMethods(6, ['social'])[0].id, 'social');
  assert.equal(rankMethods(6, ['sensory'])[0].id, 'sensory');
  assert.equal(rankMethods(1, ['social'])[0].id, 'physical');
  assert.equal(makePlan(1, ['body'], 'creative').primary, 'creative');
  assert.equal(makePlan(6, ['body', 'social', 'sensory']).steps.length, 3);
});
test('reassessment requires explicit energy and every selected symptom', () => {
  const p = makePlan(6, ['body', 'social']);
  assert.throws(() => evaluateRecovery(p, null, { body: 'same', social: 'same' }));
  assert.throws(() => evaluateRecovery(p, 7, { body: 'better' }));
  assert.throws(() => evaluateRecovery(p, 7, { body: 'invalid', social: 'same' }));
  assert.equal(evaluateRecovery(makePlan(6, []), 6, {}).kind, 'same');
});
test('worsened symptoms override increased energy, and low energy never rushes return', () => {
  const p = makePlan(6, ['body']);
  assert.equal(evaluateRecovery(p, 9, { body: 'worse' }).kind, 'gentle');
  assert.equal(evaluateRecovery(p, 5, { body: 'better' }).kind, 'gentle');
  assert.equal(evaluateRecovery(p, 7, { body: 'same' }).kind, 'better');
  assert.equal(evaluateRecovery(p, 6, { body: 'better' }).kind, 'better');
  assert.equal(evaluateRecovery(p, 6, { body: 'same' }).kind, 'same');
  const result = evaluateRecovery(makePlan(0, ['body']), 3, { body: 'better' });
  assert.equal(result.kind, 'rest');
  assert.deepEqual(result.pacing, pacing(3));
  assert.equal(result.delta, 3);
});
test('timer uses elapsed wall time, clamps expiration, and survives background delay', () => {
  assert.equal(remainingSeconds(120000, 0), 120);
  assert.equal(remainingSeconds(120000, 60001), 60);
  assert.equal(remainingSeconds(120000, 119999), 1);
  assert.equal(remainingSeconds(120000, 200000), 0);
});
