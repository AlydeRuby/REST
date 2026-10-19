import test from 'node:test';
import assert from 'node:assert/strict';
import { english, translate } from '../skills/rest/assets/app/i18n.js';
import { needs, methods, makePlan, evaluateRecovery } from '../skills/rest/assets/app/core.js';
import { RainSound } from '../skills/rest/assets/app/rain.js';
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
test('recording loads only on request, loops, and reuses playback after pause', async () => {
  let created = 0, starts = 0, pauses = 0;
  const audio = { async play() { starts++; }, pause() { pauses++; } };
  const rain = new RainSound(() => { created++; return audio; });
  assert.equal(created, 0);
  await rain.start(); await rain.start();
  assert.equal(audio.loop, true);
  assert.equal(audio.preload, 'none');
  assert.match(audio.src, /\/gentle-rain\.mp3$/);
  assert.equal(starts, 1); assert.equal(rain.playing, true);
  rain.stop(); assert.equal(rain.playing, false);
  await rain.start(); assert.equal(created, 1); assert.equal(starts, 2);
  rain.stop(); assert.equal(pauses, 2);
});
test('failed audio playback stays off and can be retried', async () => {
  let blocked = true;
  const audio = { async play() { if (blocked) throw new Error('blocked'); }, pause() {} };
  const rain = new RainSound(() => audio);
  await assert.rejects(rain.start(), /blocked/);
  assert.equal(rain.playing, false);
  blocked = false; await rain.start(); assert.equal(rain.playing, true);
  rain.stop();
});
