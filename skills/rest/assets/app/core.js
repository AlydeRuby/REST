export const needs = [
  { id: 'body', label: '身體疲倦', detail: '想恢復體力' },
  { id: 'mind', label: '腦袋很滿', detail: '想暫停思考' },
  { id: 'emotion', label: '心緒不安', detail: '想安頓情緒' },
  { id: 'social', label: '有點孤單', detail: '想要陪伴' },
  { id: 'sensory', label: '感官過載', detail: '想安靜一下' }
];
export const methods = [
  { id: 'physical', domain: '生理', name: '身體休息', icon: 'bed', subtitle: '放下用力，讓身體歇一歇', target: 'bed', weights: { body: 5 }, title: '找一個舒服的姿勢', action: '坐下或躺下，讓背部與雙腳有支撐。鬆開肩膀，舒服地休息，不必要求自己睡著。', minutes: 8 },
  { id: 'sensory', domain: '生理', name: '感官休息', icon: 'moon', subtitle: '把聲光與通知調低一點', target: 'window', weights: { sensory: 6, mind: 1 }, title: '讓世界安靜一點', action: '將螢幕放到一旁，調低燈光與聲音。看向柔和的遠處，或在舒服時輕閉雙眼。', minutes: 5 },
  { id: 'mental', domain: '心理', name: '心智休息', icon: 'cloud', subtitle: '暫時不用想出所有答案', target: 'desk', weights: { mind: 5, emotion: 1 }, title: '把腦中的事暫放紙上', action: '寫下正在佔據腦袋的幾件事，再圈出一件稍後才處理的事。把紙放下，暫停解決問題。', minutes: 5 },
  { id: 'emotional', domain: '心理', name: '情緒休息', icon: 'heart', subtitle: '允許此刻的感受存在', target: 'rug', weights: { emotion: 5 }, title: '給此刻的感受一點空間', action: '輕輕說出現在的感受，例如「我有些焦躁」。不必分析原因，也不用急著變好，先陪自己坐一會兒。', minutes: 5 },
  { id: 'creative', domain: '心理', name: '創造休息', icon: 'leaf', subtitle: '只欣賞，不必有產出', target: 'plant', weights: { mind: 2, emotion: 1 }, title: '看看不需要完成的美好', action: '看看窗邊的植物、天空或喜歡的小物。留意一種顏色與一個細節，今天不用從中得到靈感。', minutes: 5 },
  { id: 'social', domain: '社會・環境', name: '社交休息', icon: 'cup', subtitle: '選擇讓你自在的陪伴', target: 'cup', weights: { social: 6 }, title: '找一份沒有壓力的陪伴', action: '如果願意，聯絡一位相處自在的人，說「想和你聊幾分鐘」。對方不方便時，先讀一段溫暖的文字也可以。', minutes: 8 },
  { id: 'spiritual', domain: '社會・環境', name: '心靈休息', icon: 'sun', subtitle: '留一點空白，回到在乎的事', target: 'window', weights: { emotion: 2, social: 1 }, title: '回到一件你在乎的小事', action: '想起今天一件讓你感到連結的小事：一段關係、自然，或自己的信念。安靜坐著，不需要找到宏大的答案。', minutes: 5 }
];
export function validEnergy(value) { return Number.isInteger(value) && value >= 0 && value <= 10; }
export function validateAssessment(energy, selectedNeeds) {
  if (!validEnergy(energy)) throw new RangeError('請先選擇 0–10 的能量。');
  if (!Array.isArray(selectedNeeds) || selectedNeeds.some(id => !needs.some(n => n.id === id)) || new Set(selectedNeeds).size !== selectedNeeds.length) throw new TypeError('需要選項無效。');
}
export function rankMethods(energy, selectedNeeds) {
  validateAssessment(energy, selectedNeeds);
  return methods.map((m, order) => ({ method: m, order, score: selectedNeeds.reduce((s, n) => s + (m.weights[n] || 0), 0) + (m.id === 'physical' && energy <= 3 ? 7 : 0) }))
    .sort((a, b) => b.score - a.score || a.order - b.order).map(x => x.method);
}
export function pacing(energy) {
  if (energy <= 3) return { title: '先休息，暫緩非必要的工作', text: '如果有非做不可的小事，可先試 5 分鐘，再休息 5–10 分鐘；仍覺得吃力就停下。' };
  if (energy <= 6) return { title: '小段進行，保留一點餘裕', text: '試著專注 15 分鐘、休息 5 分鐘。先做一件簡單的事，再依感受決定是否繼續。' };
  return { title: '穩穩地做，不必把能量用完', text: '可以從專注 25 分鐘、休息 5 分鐘開始。一次處理一件事，感到累就提早休息。' };
}
export function makePlan(energy, selectedNeeds, manual = null) {
  const ranked = rankMethods(energy, selectedNeeds);
  const primary = manual ? methods.find(m => m.id === manual) : ranked[0];
  if (!primary) throw new TypeError('休養方式無效。');
  const secondary = ranked.find(m => m.id !== primary.id && selectedNeeds.some(n => m.weights[n] >= 5));
  const steps = [{ title: '先把這幾分鐘留給自己', action: selectedNeeds.includes('sensory') ? '將通知暫時靜音，移到聲光較柔和的位置。讓雙腳與身體安穩地靠著。' : '暫停手邊的事，把待辦放到一旁。找到舒服的位置，照自己的節奏呼吸。', minutes: 2, method: 'settle' }, { title: primary.title, action: primary.action, minutes: primary.minutes + (energy <= 3 && primary.id === 'physical' ? 2 : 0), method: primary.id }];
  if (secondary && energy > 3) steps.push({ title: secondary.title, action: secondary.action, minutes: 3, method: secondary.id });
  return { energy, needs: [...selectedNeeds], primary: primary.id, manual: !!manual, steps, total: steps.reduce((s, x) => s + x.minutes, 0), pacing: pacing(energy) };
}
export function evaluateRecovery(plan, after, symptoms) {
  validateAssessment(plan.energy, plan.needs);
  if (!validEnergy(after)) throw new RangeError('請評估恢復後的能量。');
  if (plan.needs.some(n => !['better', 'same', 'worse'].includes(symptoms[n]))) throw new TypeError('請完成每一項感受評估。');
  const delta = after - plan.energy;
  const worse = plan.needs.some(n => symptoms[n] === 'worse');
  const better = plan.needs.some(n => symptoms[n] === 'better');
  if (delta < 0 || worse) return { kind: 'gentle', delta, title: '現在，先不用勉強自己', text: '能量下降或有些感受加重了。先暫緩工作，換到舒服、安靜的位置；這次不增加練習。若不適持續或影響日常，可向可信任的人或專業人員尋求支持。', pacing: pacing(0) };
  if (after <= 3) return { kind: 'rest', delta, title: '有照顧自己，就已經很好', text: '目前的能量仍偏低。給自己多一點休息時間，不需要因為完成計時就立刻回到工作。', pacing: pacing(after) };
  if (delta > 0 || better) return { kind: 'better', delta, title: '一點點恢復，也值得被看見', text: '記住這次有幫助的方式。接下來從一件小事開始，保留休息空間；有些感受還沒改變也沒關係。', pacing: pacing(after) };
  return { kind: 'same', delta, title: '沒有明顯變化，也沒有關係', text: '休息不需要立刻見效。可以再留幾分鐘空白，或選擇另一種休養方式，依自己的感受調整。', pacing: pacing(after) };
}
export function remainingSeconds(deadline, now) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
