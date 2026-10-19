import test from 'node:test';
import assert from 'node:assert/strict';
import { english, translate } from '../skills/rest/assets/app/i18n.js';
import { needs, methods, makePlan, evaluateRecovery } from '../skills/rest/assets/app/core.js';
import { RainSound, makeRainSamples } from '../skills/rest/assets/app/rain.js';
const isEnglish = source => assert.doesNotMatch(translate(source, 'en'), /[\u3400-\u9fff]/, source);
test('English covers all methods, plan content, pacing, and recovery outcomes', () => {
  for (const source of Object.keys(english)) { assert.equal(translate(source), source); isEnglish(source); }
  needs.forEach(n => { isEnglish(n.label); isEnglish(n.detail); });
  methods.forEach(m => ['domain', 'name', 'subtitle', 'title', 'action'].forEach(k => isEnglish(m[k])));
  for (let energy = 0; energy <= 10; energy++) {
    for (let bits = 0; bits < 32; bits++) {
      const selected = needs.filter((_, i) => bits & 1 << i).map(n => n.id);
      const plan = makePlan(energy, selected);
      plan.steps.forEach(s => { isEnglish(s.title); isEnglish(s.action); });
      isEnglish(plan.pacing.title); isEnglish(plan.pacing.text);
      for (const after of [0, 6, 10]) for (const symptom of ['better', 'same', 'worse']) {
        const result = evaluateRecovery(plan, after, Object.fromEntries(selected.map(n => [n, symptom])));
        isEnglish(result.title); isEnglish(result.text); isEnglish(result.pacing.text);
      }
    }
  }
});
test('dynamic English copy preserves numbers, selected needs, and method names', () => {
  assert.equal(translate('0 分，共 10 分', 'en'), '0 out of 10');
  assert.equal(translate('第 2 / 3 步 · 休息中', 'en'), 'Step 2 / 3 · Resting');
  assert.equal(translate('  共 13 分鐘  ', 'en'), '  13 min total  ');
  assert.equal(translate('身體疲倦，現在呢？', 'en'), 'Physically tired — how is it now?');
  const intro = translate('依照你選擇的「社交休息」開始。照顧到：身體疲倦、有點孤單。時間只是提案，舒服最重要。', 'en');
  assert.match(intro, /Your choice: Social rest/); assert.match(intro, /Physically tired, Feeling lonely/); isEnglish(intro);
  isEnglish('這次先從「身體休息」開始。今天先留一點單純的休息時間。時間只是提案，舒服最重要。');
  isEnglish('不必一定變好，只要誠實地感受現在。恢復前的能量：6 / 10。');
  assert.equal(translate('— / 10', 'en'), '— / 10');
});
test('light drizzle is deterministic, bounded, and quieter than the original white noise', () => {
  const samples = makeRainSamples(48000);
  assert.deepEqual(samples, makeRainSamples(48000));
  assert.notDeepEqual(samples, makeRainSamples(48000, 8378));
  assert.ok(samples.every(n => Number.isFinite(n) && Math.abs(n) <= 1));
  assert.ok(Math.abs(samples.reduce((s, x) => s + x, 0) / samples.length) < 0.02);
  const power = samples.reduce((s, x) => s + x * x, 0) / samples.length;
  assert.ok(power > 0.001, 'Drizzle should remain audible');
  assert.ok(power < 0.05, 'Drizzle should be much gentler than full white noise (power ~0.33)');
});
test('rain stays silent until requested; repeated starts and stop/restart have correct lifecycle', async () => {
  let contexts = 0; let starts = 0; let stops = 0;
  const param = () => ({ value: 0, setValueAtTime(v) { this.value = v; }, linearRampToValueAtTime(v) { this.value = v; }, cancelScheduledValues() {} });
  const node = () => ({ connect(next) { return next; }, disconnect() {} });
  const rain = new RainSound(() => {
    contexts++;
    return { state: 'suspended', currentTime: 10, sampleRate: 100, destination: node(), async resume() { this.state = 'running'; }, createBuffer(ch, length) { return { length, copyToChannel() {} }; }, createBufferSource() { return { ...node(), start() { starts++; }, stop(time) { assert.ok(time > 10); stops++; } }; }, createBiquadFilter() { return { ...node(), frequency: param(), Q: param() }; }, createGain() { return { ...node(), gain: param() }; } };
  });
  assert.equal(contexts, 0); assert.equal(rain.playing, false);
  await rain.start(); await rain.start(); assert.equal(starts, 1); assert.equal(rain.playing, true);
  rain.stop(); rain.stop(); assert.equal(stops, 1); assert.equal(rain.playing, false);
  await rain.start(); assert.equal(starts, 2); assert.equal(contexts, 1); rain.stop();
});
