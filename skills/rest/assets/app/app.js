import { needs, methods, rankMethods, makePlan, evaluateRecovery, remainingSeconds } from './core.js';
import { icon, room } from './room.js';
import { installLocalization } from './i18n.js';
import { RainSound } from './rain.js';
const $ = id => document.getElementById(id);
const state = { energy: null, needs: [], manual: null, plan: null, after: null, symptoms: {}, step: 0, remaining: 0, deadline: null, reviewed: false, night: false, lamp: true };
const announce = text => { $('announcement').textContent = text; };
const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
function focusSection(id) { $(id).focus({ preventScroll: true }); $(id).scrollIntoView({ behavior: motion(), block: 'start' }); }
function fillIcons() { document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
$('room-art').innerHTML = room;
$('needs').innerHTML = needs.map(n => `<label class="need-chip" title="${n.detail}"><input type="checkbox" value="${n.id}" id="need-${n.id}"><span>${n.label}</span></label>`).join('');
$('method-groups').innerHTML = ['生理', '心理', '社會・環境'].map(domain => `<div class="method-domain"><h3 class="domain-heading">${domain}</h3><div class="method-list">${methods.filter(m => m.domain === domain).map(m => `<button class="method-tile" id="method-${m.id}" data-method="${m.id}" aria-pressed="false" title="${m.subtitle}">${icon(m.icon)}<strong>${m.name}</strong><span class="recommend-badge" hidden>推薦</span></button>`).join('')}</div></div>`).join('');
fillIcons();
function currentMethod() { return state.manual || (state.energy === null ? null : rankMethods(state.energy, state.needs)[0].id); }
function updateSelection() {
  const recommended = state.energy === null ? null : rankMethods(state.energy, state.needs)[0].id;
  const selected = currentMethod();
  document.querySelectorAll('[data-method]').forEach(el => { el.setAttribute('aria-pressed', String(el.dataset.method === selected)); el.querySelector('.recommend-badge').hidden = el.dataset.method !== recommended; });
  $('choice-label').textContent = state.manual ? '自己選的，也很好' : '為你推薦';
  $('choice-name').textContent = selected ? methods.find(m => m.id === selected).name : '先聽聽自己的感受';
  $('auto-mode').hidden = !state.manual;
  $('generate').disabled = state.energy === null;
  $('generate-help').textContent = state.energy === null ? '選好能量，就能開始。需要選項可留空。' : '安排可以隨時調整，不需要做到完美。';
  const method = methods.find(m => m.id === selected);
  document.querySelectorAll('[data-object]').forEach(el => el.classList.toggle('active', el.dataset.object === method?.target));
  $('room-caption').textContent = method ? method.subtitle : '留一盞燈，也留一點時間給自己。';
}
const emptyPlan = $('plan-content').innerHTML;
function invalidatePlan() {
  if (!state.plan) return;
  state.plan = null; state.deadline = null; state.after = null; state.symptoms = {}; state.reviewed = false;
  $('plan-content').innerHTML = emptyPlan; fillIcons(); $('plan-duration').textContent = '重新安排'; $('review-section').hidden = true;
  announce('評估已調整，請重新安排休養。');
}
function setEnergy() {
  const value = Number($('energy').value);
  if (state.energy !== value) invalidatePlan();
  state.energy = value;
  $('energy').classList.remove('unassessed'); $('energy').setAttribute('aria-valuetext', `${value} 分，共 10 分`);
  $('energy-value').innerHTML = `${value} <small>/ 10</small>`;
  $('energy-help').textContent = value <= 3 ? '現在可以先把休息放在前面。' : value <= 6 ? '保留一點餘裕，慢慢找回自己的節奏。' : '感覺還不錯，也值得給自己一小段留白。';
  updateSelection();
}
$('energy').addEventListener('input', setEnergy);
$('energy').addEventListener('pointerup', setEnergy);
$('energy').addEventListener('keydown', e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); setEnergy(); } });
$('needs').addEventListener('change', () => { invalidatePlan(); state.needs = needs.filter(n => $(`need-${n.id}`).checked).map(n => n.id); updateSelection(); });
$('method-groups').addEventListener('click', e => { const tile = e.target.closest('[data-method]'); if (!tile) return; if (state.manual !== tile.dataset.method) invalidatePlan(); state.manual = tile.dataset.method; updateSelection(); announce(`已選擇${methods.find(m => m.id === state.manual).name}`); });
$('auto-mode').addEventListener('click', () => { invalidatePlan(); state.manual = null; updateSelection(); $('generate').focus(); });
$('night-toggle').addEventListener('click', () => { state.night = !state.night; document.querySelector('.room-card').classList.toggle('night', state.night); $('night-toggle').setAttribute('aria-pressed', String(state.night)); });
$('lamp-toggle').addEventListener('click', () => { state.lamp = !state.lamp; document.querySelector('.room-card').classList.toggle('lamp-off', !state.lamp); $('lamp-toggle').setAttribute('aria-pressed', String(state.lamp)); });
function renderPlan() {
  const plan = state.plan;
  const method = methods.find(m => m.id === plan.primary);
  $('plan-duration').textContent = `共 ${plan.total} 分鐘`;
  $('plan-content').innerHTML = `<p class="plan-intro">${plan.manual ? '依照你選擇的' : '這次先從'}「${method.name}」開始。${plan.needs.length ? `照顧到：${plan.needs.map(n => needs.find(x => x.id === n).label).join('、')}。` : '今天先留一點單純的休息時間。'}時間只是提案，舒服最重要。</p><div class="plan-grid"><ol class="plan-steps">${plan.steps.map((s, i) => `<li class="plan-step" id="step-${i}"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><div class="step-text"><header><h3>${s.title}</h3><small>${s.minutes} 分鐘</small></header><p>${s.action}</p></div></li>`).join('')}</ol><aside class="pacing-card"><p class="eyebrow">WORK, A LITTLE SOFTER</p><h3>${plan.pacing.title}</h3><p>${plan.pacing.text}</p></aside></div><div class="timer-bar"><div><div class="timer-value" id="timer-value" role="timer" aria-label="本步驟剩餘時間"></div><p class="timer-label" id="timer-label"></p></div><div class="timer-actions"><button id="timer-toggle" class="primary-button">開始這一步</button><button id="timer-reset" class="secondary-button">重設本步</button><button id="timer-next" class="secondary-button">完成這一步 →</button><button id="open-review" class="text-button">直接評估</button></div></div>`;
  $('timer-toggle').addEventListener('click', toggleTimer);
  $('timer-reset').addEventListener('click', () => { state.deadline = null; state.remaining = state.plan.steps[state.step].minutes * 60; updateTimer(); announce('本步計時已重設。'); });
  $('timer-next').addEventListener('click', advanceStep);
  $('open-review').addEventListener('click', () => { state.deadline = null; updateTimer(); showReview(); });
  updateTimer();
}
function updateTimer() {
  if (!state.plan || !$('timer-value')) return;
  const finished = state.step >= state.plan.steps.length;
  const seconds = state.remaining;
  $('timer-value').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  $('timer-label').textContent = finished ? '這次安排已完成，慢慢回來。' : `第 ${state.step + 1} / ${state.plan.steps.length} 步 · ${state.deadline ? '休息中' : seconds === 0 ? '時間到了，依感受繼續' : '照自己的節奏'}`;
  $('timer-toggle').textContent = state.deadline ? '暫停' : seconds === 0 ? '本步已到時' : '開始／繼續';
  $('timer-toggle').disabled = finished || seconds === 0;
  $('timer-reset').disabled = finished;
  $('timer-next').disabled = finished;
  $('timer-next').textContent = state.step === state.plan.steps.length - 1 ? '完成，回顧感受 →' : '完成這一步 →';
  state.plan.steps.forEach((_, i) => { $(`step-${i}`).classList.toggle('current', i === state.step); $(`step-${i}`).classList.toggle('done', i < state.step); if (i === state.step) $(`step-${i}`).setAttribute('aria-current', 'step'); else $(`step-${i}`).removeAttribute('aria-current'); });
}
function toggleTimer() {
  if (state.deadline) { state.remaining = remainingSeconds(state.deadline, Date.now()); state.deadline = null; }
  else state.deadline = Date.now() + state.remaining * 1000;
  updateTimer();
}
function tick() {
  if (!state.deadline) return;
  state.remaining = remainingSeconds(state.deadline, Date.now());
  if (state.remaining === 0) { state.deadline = null; announce('這一步的時間到了。可以按感受繼續，不需要急著完成。'); }
  updateTimer();
}
setInterval(tick, 250);
document.addEventListener('visibilitychange', tick);
function advanceStep() {
  state.deadline = null; state.step++;
  if (state.step >= state.plan.steps.length) { state.remaining = 0; updateTimer(); showReview(); }
  else { state.remaining = state.plan.steps[state.step].minutes * 60; updateTimer(); announce(`開始第 ${state.step + 1} 步：${state.plan.steps[state.step].title}`); }
}
$('generate').addEventListener('click', () => {
  if (state.energy === null) return;
  state.plan = makePlan(state.energy, state.needs, state.manual); state.step = 0; state.deadline = null; state.remaining = state.plan.steps[0].minutes * 60; state.after = null; state.symptoms = {}; state.reviewed = false;
  $('review-section').hidden = true; renderPlan(); announce('休養安排已準備好。'); focusSection('plan-section');
});
function reviewReady() { return state.after !== null && state.plan.needs.every(n => !!state.symptoms[n]); }
function reviewChanged() {
  $('evaluate').disabled = !reviewReady();
  if ($('review-result')) { $('review-result').remove(); announce('評估已修改，請按更新休養建議。'); }
}
function showReview() {
  $('review-section').hidden = false;
  if (!$('after-energy') || !state.reviewed) renderReview();
  state.reviewed = true;
  focusSection('review-section');
}
function renderReview() {
  $('review-content').innerHTML = `<p class="plan-intro">不必一定變好，只要誠實地感受現在。恢復前的能量：${state.plan.energy} / 10。</p><div class="review-grid"><div><div class="energy-heading"><label for="after-energy">恢復後的能量</label><output id="after-value" for="after-energy">— <small>/ 10</small></output></div><p class="field-help" id="after-help">尚未評估，移動滑桿選擇現在的感受。</p><input type="range" id="after-energy" min="0" max="10" value="5" step="1" class="unassessed" aria-valuetext="尚未評估" aria-describedby="after-help"><div class="range-labels"><span>0 · 需要休息</span><span>10 · 精神充足</span></div></div><div>${state.plan.needs.length ? state.plan.needs.map(n => `<fieldset class="symptom-field"><legend>${needs.find(x => x.id === n).label}，現在呢？</legend><div class="segmented">${[['better', '舒緩了'], ['same', '差不多'], ['worse', '更明顯']].map(([value, label]) => `<button data-symptom="${n}" data-value="${value}" aria-pressed="false">${label}</button>`).join('')}</div></fieldset>`).join('') : '<p class="field-help">這次沒有勾選特定需要，只評估能量就好。</p>'}</div></div><div class="review-actions"><button class="primary-button" id="evaluate" disabled>更新休養建議 ↗</button><p>選好能量與每一項感受，就能查看。</p></div>`;
  const afterChanged = () => { state.after = Number($('after-energy').value); $('after-energy').classList.remove('unassessed'); $('after-energy').setAttribute('aria-valuetext', `${state.after} 分，共 10 分`); $('after-value').innerHTML = `${state.after} <small>/ 10</small>`; $('after-help').textContent = '不和別人比較，照自己的感覺就好。'; reviewChanged(); };
  $('after-energy').addEventListener('input', afterChanged); $('after-energy').addEventListener('pointerup', afterChanged); $('after-energy').addEventListener('keydown', e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); afterChanged(); } });
  $('review-content').querySelectorAll('[data-symptom]').forEach(button => button.addEventListener('click', () => { state.symptoms[button.dataset.symptom] = button.dataset.value; $('review-content').querySelectorAll(`[data-symptom="${button.dataset.symptom}"]`).forEach(b => b.setAttribute('aria-pressed', String(b === button))); reviewChanged(); }));
  $('evaluate').addEventListener('click', () => {
    if (!reviewReady()) return;
    const result = evaluateRecovery(state.plan, state.after, state.symptoms);
    $('review-result')?.remove();
    $('review-content').insertAdjacentHTML('beforeend', `<div id="review-result" class="result ${result.kind}" tabindex="-1"><span class="result-score">${state.plan.energy} → ${state.after} <small>/ 10</small></span><h3>${result.title}</h3><p>${result.text}</p><p class="result-pacing"><strong>接下來：${result.pacing.title}</strong><br>${result.pacing.text}</p><div class="result-buttons"><button class="secondary-button" id="next-round">以現在的狀態重新安排</button><button class="text-button" id="choose-another">看看其他休養方式</button></div></div>`);
    $('next-round').addEventListener('click', () => {
      const after = state.after; const nextNeeds = state.plan.needs.filter(n => state.symptoms[n] !== 'better');
      invalidatePlan(); state.energy = after; state.needs = nextNeeds; state.manual = null;
      $('energy').value = after; needs.forEach(n => { $(`need-${n.id}`).checked = nextNeeds.includes(n.id); }); setEnergy();
      $('energy').focus(); $('assessment').scrollIntoView({ behavior: motion() }); announce('已帶入現在的能量與尚未舒緩的需要，可再調整。');
    });
    $('choose-another').addEventListener('click', () => { $(`method-${currentMethod()}`).focus(); $('methods').scrollIntoView({ behavior: motion() }); });
    announce(result.title); $('review-result').focus({ preventScroll: true }); $('review-result').scrollIntoView({ behavior: motion(), block: 'nearest' });
  });
}
$('reset').addEventListener('click', () => $('reset-dialog').showModal());
$('cancel-reset').addEventListener('click', () => $('reset-dialog').close());
$('confirm-reset').addEventListener('click', () => { state.deadline = null; location.reload(); });
updateSelection();
const localization = installLocalization();
const rain = new RainSound();
$('rain-toggle').addEventListener('click', async () => {
  const button = $('rain-toggle');
  button.disabled = true;
  try {
    if (rain.playing) rain.stop();
    else await rain.start();
    button.setAttribute('aria-pressed', String(rain.playing));
    button.setAttribute('aria-label', rain.playing ? '關閉雨天白噪音' : '開啟雨天白噪音');
    button.title = rain.playing ? '關閉雨天白噪音' : '開啟雨天白噪音';
    $('rain-state').textContent = rain.playing ? '開' : '關';
    announce(rain.playing ? '雨聲已開啟。' : '雨聲已關閉。');
  } catch {
    rain.stop();
    announce('目前無法播放雨聲，請再試一次或使用支援音訊的瀏覽器。');
  } finally {
    button.disabled = false;
    localization.apply();
  }
});
window.addEventListener('pagehide', () => rain.stop());
