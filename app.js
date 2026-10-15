'use strict';
/* ====== Lộ trình ====== */
const TOTAL = 60;
// 1–50: học mới (trừ ngày 7,14,…,49 = ôn tuần) · 51–56: tổng ôn · 57–60: thi thử
const kind = d => d <= 50 ? (d % 7 ? 'learn' : 'week') : d <= 56 ? 'total' : 'mock';
const KIND = {
  learn: ['book', 'Học mới'], week: ['repeat', 'Ôn tuần'], total: ['target', 'Tổng ôn'], mock: ['file', 'Thi thử'],
};
// Icon nét kiểu Lucide (viewBox 24, stroke 2)
const ICON = {
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',
  cards: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  vol: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M6.5 17H20v5H6.5A2.5 2.5 0 0 1 4 19.5"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  bulb: '<path d="M9 18h6M10 22h4M15 14c.2-1 .7-1.7 1.5-2.5A4.7 4.7 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>',
  swap: '<path d="M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  party: '<path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.2.8a2.8 2.8 0 0 0-1.9 3.2c.1.9-.6 1.7-1.5 1.7H16"/><path d="m22 13-.8-.3a2.6 2.6 0 0 0-3 1.3c-.4.6-1.1 1-1.8.9"/><path d="M11 2l.3.8a2.6 2.6 0 0 1-1.3 3c-.6.4-1 1.1-.9 1.8"/><path d="M11 13c1.9 1.9 2.8 4.2 2 5-.8.8-3.1-.1-5-2s-2.8-4.2-2-5c.8-.8 3.1.1 5 2z"/>',
  down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  up: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const TYPE = {
  n: 'danh từ', v1: 'động từ nhóm 1', v2: 'động từ nhóm 2', v3: 'động từ nhóm 3',
  i: 'tính từ い', na: 'tính từ な', adv: 'phó từ', x: 'khác',
};

/* ====== State (localStorage) ====== */
const KEY = 'n4';
function todayN() { const d = new Date(); return Math.floor((d - d.getTimezoneOffset() * 6e4) / 864e5); }
const blank = () => ({
  start: todayN(), done: {}, srs: {}, wrong: {}, streak: { last: 0, n: 0 },
  stat: { v: [0, 0], g: [0, 0], r: [0, 0] }, set: { furi: true },
});
let S = blank();
try { S = { ...S, ...JSON.parse(localStorage.getItem(KEY)) }; } catch (e) { /* lần đầu / không có storage */ }
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('⚠️ Không lưu được tiến độ: ' + e.message); }
}
function bump() { // streak: học bất kỳ thứ gì trong ngày
  const t = todayN(), k = S.streak;
  if (k.last === t) return;
  k.n = k.last === t - 1 ? k.n + 1 : 1;
  k.last = t;
}

/* ====== SRS (SM-2 rút gọn) — g: 0 Quên · 1 Khó · 2 Được · 3 Dễ ====== */
function grade(c, g, today) {
  c = { ef: 2.5, int: 0, reps: 0, lapse: 0, ...c };
  if (g === 0) { c.int = 1; c.ef = Math.max(1.3, c.ef - 0.2); c.lapse++; c.reps = 0; }
  else if (g === 1) { c.int = Math.max(1, Math.round(c.int * 1.2)); c.ef = Math.max(1.3, c.ef - 0.15); c.reps++; }
  else if (g === 2) { c.int = c.int ? Math.max(c.int + 1, Math.round(c.int * c.ef)) : 1; c.reps++; }
  else { c.int = c.int ? Math.round(c.int * c.ef * 1.3) + 1 : 3; c.ef += 0.15; c.reps++; }
  c.due = today + c.int;
  return c;
}
const newCard = due => ({ ef: 2.5, int: 0, reps: 0, lapse: 0, due });
const LEARNED = 21; // khoảng ôn ≥ 21 ngày = đã thuộc

/* ====== Tra cứu dữ liệu ====== */
const V = new Map(DATA.vocab.map(x => [x.w, x]));
const G = new Map(DATA.grammar.map(x => [x.p, x]));
const R = new Map(DATA.reading.map(x => [x.t, x]));
const byDay = d => ({
  v: DATA.vocab.filter(x => x.day === d), g: DATA.grammar.filter(x => x.day === d), r: DATA.reading.filter(x => x.day === d),
});
const itemOf = id => id[0] === 'v' ? V.get(id.slice(2)) : G.get(id.slice(2));

/* ====== Tiện ích ====== */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// {漢字|かんじ} → ruby, *từ* → tô sáng
const jp = s => esc(s).replace(/\*(.+?)\*/g, '<b class="hl">$1</b>').replace(/\{([^|}]+)\|([^}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>');
const fmt = s => jp(s).replace(/\n/g, '<br>');
const plain = s => s.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2').replace(/\*/g, ''); // cho TTS
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
const sample = (a, n) => shuffle([...a]).slice(0, n);
const dateOf = n => new Date(n * 864e5).toLocaleDateString('vi-VN', { timeZone: 'UTC', day: '2-digit', month: '2-digit' });
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200); }
function speak(t) {
  if (!window.speechSynthesis) return toast('Trình duyệt không hỗ trợ đọc');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t); u.lang = 'ja-JP'; u.rate = 0.9;
  speechSynthesis.speak(u);
}
const say = t => `<button class="ic sm" data-say="${esc(t)}" aria-label="Nghe phát âm" title="Nghe">${ic('vol')}</button>`;
const addBtn = id => `<button class="add ${S.srs[id] ? 'on' : ''}" data-add="${esc(id)}" aria-pressed="${!!S.srs[id]}">${ic(S.srs[id] ? 'check' : 'plus')}Flashcard</button>`;
const note = (icon, s) => `<p class="note">${ic(icon)}<span>${fmt(s)}</span></p>`;
const exHTML = ([j, v]) => `<div class="ex">${say(plain(j))}<div><div class="jp">${jp(j)}</div><div class="vi">${esc(v)}</div></div></div>`;
const nextDay = () => { for (let d = 1; d <= TOTAL; d++) if (!S.done[d]) return d; return 0; };
const dueIds = (t = todayN()) => Object.keys(S.srs).filter(id => S.srs[id].due <= t && itemOf(id));

function vocabHTML(x) {
  return `<div class="card">
    <div class="row"><span class="w">${esc(x.w)}</span>${x.w !== x.k ? `<span class="k">${esc(x.k)}</span>` : ''}${say(x.k)}<span class="push">${addBtn('v:' + x.w)}</span></div>
    <div class="m">${x.hv ? `<span class="hv">${esc(x.hv)}</span>` : ''}${esc(x.m)} <span class="t">· ${TYPE[x.t] || ''}</span></div>
    ${x.ex.map(exHTML).join('')}
    ${x.n ? note('bulb', x.n) : ''}
  </div>`;
}
function grammarHTML(x) {
  return `<div class="card">
    <div class="row"><span class="w">${jp(x.p)}</span><span class="push">${addBtn('g:' + x.p)}</span></div>
    <div class="m"><b>${esc(x.m)}</b></div>
    <div class="form">${jp(x.f)}</div>
    <p>${fmt(x.e)}</p>
    ${x.ex.map(exHTML).join('')}
    ${x.cmp ? note('swap', x.cmp) : ''}
  </div>`;
}

/* ====== Sinh câu hỏi ====== */
// Câu hỏi: {id, sec:'v'|'g'|'r', q, c:[html], a, why, ctx?}
function distract(x, key) {
  // ponytail: phương án nhiễu chọn ngẫu nhiên cùng loại từ; không kiểm tra "cũng điền được" — phần giải thích nêu nghĩa từng từ để bù
  let pool = DATA.vocab.filter(y => y.t === x.t && y[key] !== x[key] && Math.abs(y.day - x.day) <= 15);
  if (pool.length < 3) pool = DATA.vocab.filter(y => y[key] !== x[key]);
  const seen = new Set([x[key]]), out = [];
  for (const y of shuffle(pool)) { if (!seen.has(y[key])) { seen.add(y[key]); out.push(y); } if (out.length === 3) break; }
  return out;
}
function vq(type, x) { // r: cách đọc · m: nghĩa · f: điền vào câu
  const key = { r: 'k', m: 'm', f: 'w' }[type];
  const ds = distract(x, key), opts = shuffle([x, ...ds]);
  const q = {
    r: `<span class="big">${esc(x.w)}</span>Từ trên đọc là gì?`,
    m: `<span class="big">${esc(x.w)}</span>Nghĩa của từ trên là gì?`,
    f: `<div class="jp big2">${jp(x.ex[0][0].replace(/\*.+?\*/, '（　　）'))}</div>Chọn từ thích hợp cho （　　） <span class="muted">(trong câu có thể đã chia thể)</span>`,
  }[type];
  const why = `<p>✔ <b>${esc(x.w)}</b>（${esc(x.k)}）${x.hv ? ' – ' + esc(x.hv) : ''}: ${esc(x.m)}</p>`
    + (type === 'f' ? `<p class="jp">${jp(x.ex[0][0])}</p><p class="vi">→ ${esc(x.ex[0][1])}</p>` : '')
    + ds.map(y => `<p>✘ ${esc(y.w)}（${esc(y.k)}）: ${esc(y.m)}</p>`).join('')
    + (x.n ? note('bulb', x.n) : '');
  return { id: `v${type}:${x.w}`, sec: 'v', q, c: opts.map(y => esc(y[key])), a: opts.indexOf(x), why };
}
const randVq = x => vq(sample(x.w !== x.k ? ['r', 'm', 'f'] : ['m', 'f'], 1)[0], x);
function mcq(id, sec, o, extra, ctx) { // câu viết tay: đảo phương án, giữ đáp án
  const order = shuffle(o.c.map((_, i) => i));
  return { id, sec, ctx, q: `<div class="jp big2">${fmt(o.q)}</div>`, c: order.map(i => jp(o.c[i])), a: order.indexOf(o.a), why: `<p>${fmt(o.w)}</p>${extra}` };
}
const gq = (x, i) => mcq(`g:${x.p}#${i}`, 'g', x.q[i], `<p class="muted">Mẫu: <b>${jp(x.p)}</b> – ${esc(x.m)}</p>`);
const rq = (x, i) => mcq(`r:${x.t}#${i}`, 'r', x.qs[i], '', `<h2>${esc(x.t)}</h2><div class="passage jp">${jp(x.text)}</div>`);
function qFromId(id) {
  const c = id.indexOf(':'), k = id.slice(0, c), rest = id.slice(c + 1), h = rest.lastIndexOf('#');
  if (k[0] === 'v' && k.length === 2) { const x = V.get(rest); return x && vq(k[1], x); }
  const key = rest.slice(0, h), i = +rest.slice(h + 1);
  if (k === 'g') { const x = G.get(key); return x && x.q[i] && gq(x, i); }
  if (k === 'r') { const x = R.get(key); return x && x.qs[i] && rq(x, i); }
}
const gqAll = list => list.flatMap(x => x.q.map((_, i) => gq(x, i)));
const rqAll = list => list.flatMap(x => x.qs.map((_, i) => rq(x, i)));

function dayQuiz(d) {
  const { v, g, r } = byDay(d);
  return [...shuffle(v.map(randVq)), ...shuffle(gqAll(g)), ...rqAll(r)];
}
function weekQuiz(d) {
  const days = x => x.day > d - 7 && x.day < d;
  return [...sample(DATA.vocab.filter(days), 20).map(randVq), ...sample(gqAll(DATA.grammar.filter(days)), 10)];
}
function totalQuiz() { // ưu tiên mục yếu: sổ lỗi sai → thẻ hay quên → ngẫu nhiên
  const seen = new Set(), out = [];
  const push = q => { if (q && !seen.has(q.id) && out.length < 30) { seen.add(q.id); out.push(q); } };
  Object.entries(S.wrong).sort((a, b) => b[1].n - a[1].n).slice(0, 12).forEach(([id]) => push(qFromId(id)));
  Object.entries(S.srs).filter(([, c]) => c.ef < 2.3 || c.lapse).sort((a, b) => a[1].ef - b[1].ef)
    .forEach(([id]) => { const x = itemOf(id); if (x) push(id[0] === 'v' ? randVq(x) : gq(x, Math.random() * x.q.length | 0)); });
  sample(DATA.vocab, 20).forEach(x => push(randVq(x)));
  sample(gqAll(DATA.grammar), 10).forEach(push);
  return shuffle(out);
}
function mockQuiz() { // mô phỏng cấu trúc JLPT: 文字・語彙 → 文法 → 読解
  const vs = sample(DATA.vocab, 25);
  const vqs = vs.map((x, i) => vq(i < 9 && x.w !== x.k ? 'r' : i < 18 ? 'f' : 'm', x));
  return [...vqs, ...sample(gqAll(DATA.grammar), 15), ...rqAll(sample(DATA.reading, 3))];
}

/* ====== Quiz runner ====== */
let Q = null, timer = 0;
function startQuiz(title, list, opt = {}) {
  if (!list.length) return toast('Chưa có câu hỏi nào');
  Q = { title, list, i: 0, picked: [], ...opt };
  if (Q.exam) Q.end = Date.now() + Q.exam * 60e3;
  if (location.hash === '#/quiz') route(); else location.hash = '#/quiz';
}
function record(q, ok) {
  const st = S.stat[q.sec]; st[1]++; if (ok) st[0]++;
  const w = S.wrong[q.id];
  if (!ok) S.wrong[q.id] = { n: (w ? w.n : 0) + 1, ok: 0 };
  else if (w && ++w.ok >= 2) delete S.wrong[q.id]; // đúng 2 lần liên tiếp → ra khỏi sổ
}
function quizView() {
  const app = $('#app');
  if (!Q) return (location.hash = '#/');
  if (Q.i >= Q.list.length) return quizResult();
  const q = Q.list[Q.i], p = Q.picked[Q.i], shown = p !== undefined && !Q.exam;
  app.innerHTML = `
    <div class="qhead"><span>${esc(Q.title)}</span><span>${Q.exam ? `${ic('clock')} <b id="timer"></b> · ` : ''}<b>${Q.i + 1}</b>/${Q.list.length}</span></div>
    <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${Q.list.length}" aria-valuenow="${Q.i}"><i style="width:${Q.i / Q.list.length * 100}%"></i></div>
    ${q.ctx ? `<div class="card ctx">${q.ctx}</div>` : ''}
    <div class="card">${q.q}
      <div class="opts" role="group" aria-label="Các phương án">${q.c.map((c, i) => {
        const st = shown ? (i === q.a ? 'ok' : i === p ? 'bad' : '') : i === p ? 'pick' : '';
        return `<button class="opt ${st}" ${shown ? 'disabled' : ''} onclick="pick(${i})"><span class="key">${i + 1}</span><span>${c}</span>${st === 'ok' ? `<span class="mk">${ic('check')}</span>` : st === 'bad' ? `<span class="mk">${ic('x')}</span>` : ''}</button>`;
      }).join('')}</div>
      ${shown ? `<div class="why ${p === q.a ? 'ok' : 'bad'}" id="why"><p class="verdict">${p === q.a ? ic('check') + 'Chính xác!' : ic('x') + 'Chưa đúng, xem giải thích:'}</p>${q.why}</div>` : ''}
      <div class="row">
        ${Q.exam && Q.i ? `<button class="btn ghost" onclick="Q.i--;route()">${ic('left')}Câu trước</button>` : ''}
        ${shown || (Q.exam && p !== undefined) ? `<button class="btn push" id="next" onclick="nextQ()">${Q.i + 1 < Q.list.length ? 'Câu tiếp' : 'Xem kết quả'}${ic('right')}</button><kbd class="hint">Enter</kbd>` : ''}
      </div>
    </div>`;
  if (shown) { const w = $('#next'); w.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); $('#next').focus({ preventScroll: true }); }
  if (Q.exam) tick();
}
function pick(i) {
  if (Q.picked[Q.i] !== undefined && !Q.exam) return;
  Q.picked[Q.i] = i;
  if (!Q.exam) { const q = Q.list[Q.i]; record(q, i === q.a); bump(); save(); }
  quizView();
}
function nextQ() { Q.i++; route(); }
function tick() {
  const left = Math.max(0, Q.end - Date.now()), el = $('#timer');
  if (el) el.textContent = `${left / 6e4 | 0}:${String((left / 1e3 | 0) % 60).padStart(2, '0')}`;
  clearTimeout(timer);
  if (!left) { Q.i = Q.list.length; return route(); }
  timer = setTimeout(tick, 1000);
}
function quizResult() {
  clearTimeout(timer);
  if (!Q.scored) { // chấm 1 lần
    Q.scored = true;
    if (Q.exam) { Q.list.forEach((q, i) => record(q, Q.picked[i] === q.a)); bump(); }
    Q.score = Q.list.filter((q, i) => Q.picked[i] === q.a).length;
    if (Q.onDone) Q.onDone(Q.score, Q.list.length);
    save();
  }
  const sec = { v: 'Từ vựng', g: 'Ngữ pháp', r: 'Đọc hiểu' };
  const by = Object.keys(sec).map(s => {
    const l = Q.list.map((q, i) => [q, i]).filter(([q]) => q.sec === s);
    return l.length ? `<div class="stat"><b>${l.filter(([q, i]) => Q.picked[i] === q.a).length}/${l.length}</b><span>${sec[s]}</span></div>` : '';
  }).join('');
  const pct = Math.round(Q.score / Q.list.length * 100);
  const wrong = Q.list.map((q, i) => [q, i]).filter(([q, i]) => Q.picked[i] !== q.a);
  $('#app').innerHTML = `
    <h1>${esc(Q.title)}: kết quả</h1>
    <div class="card"><span class="score" style="color:var(--${pct >= 60 ? 'ok' : 'bad'})">${pct}%</span> <span class="muted">${Q.score}/${Q.list.length} câu đúng</span>
      <p>${pct >= 80 ? 'Rất tốt! Giữ nhịp này nhé.' : pct >= 60 ? 'Đạt. Xem lại các câu sai bên dưới, chúng đã vào Sổ lỗi sai.' : 'Nên đọc lại bài rồi làm lại quiz. Câu sai đã được lưu để ôn.'}</p>
      <div class="row"><a class="btn" href="${Q.back || '#/'}">Tiếp tục${ic('right')}</a><button class="btn ghost" onclick="retry()">${ic('repeat')}Làm lại</button></div></div>
    <div class="stats">${by}</div>
    ${wrong.length ? `<h2>Câu sai (${wrong.length}): bấm để xem giải thích</h2>` : ''}
    ${wrong.map(([q, i]) => `<details class="sec"><summary>${q.q.replace(/<[^>]+>/g, ' ').slice(0, 60)}</summary><div class="body">
      ${q.ctx ? `<details><summary class="muted">Đoạn văn</summary>${q.ctx}</details>` : ''}${q.q}
      <div class="opts">${q.c.map((c, j) => `<div class="opt ${j === q.a ? 'ok' : j === Q.picked[i] ? 'bad' : ''}"><span class="key">${j + 1}</span><span>${c}</span>${j === q.a ? `<span class="mk">${ic('check')}</span>` : j === Q.picked[i] ? `<span class="mk">${ic('x')}</span>` : ''}</div>`).join('')}</div>
      <div class="why">${q.why}</div></div></details>`).join('')}`;
}
function retry() { startQuiz(Q.title, Q.redo ? Q.redo() : shuffle(Q.list), { exam: Q.exam, back: Q.back, redo: Q.redo }); }

/* ====== Views ====== */
function home() { const d = nextDay(); d ? dayView(d, true) : finished(); }
function finished() {
  $('#app').innerHTML = `<div class="card"><h1>${ic('party')}Hoàn thành lộ trình 60 ngày!</h1>
    <p>Hãy tiếp tục ôn flashcard mỗi ngày đến ngày thi để giữ trí nhớ dài hạn.</p>
    <a class="btn" href="#/review">Ôn flashcard (${dueIds().length})</a></div>`;
}
function dayView(d, isToday) {
  if (!(d >= 1 && d <= TOTAL)) return home();
  const k = kind(d), [icon, label] = KIND[k], done = S.done[d], due = dueIds().length;
  const nW = Object.keys(S.wrong).length;
  let body = '';
  const review = due
    ? `<div class="banner">${ic('cards')}<span><b>${due}</b> thẻ đến hạn. Ôn trước khi học mới để nhớ lâu hơn.</span><a class="btn" href="#/review">Ôn ngay</a></div>`
    : `<div class="banner">${ic('check')}<span>Không có thẻ đến hạn. Bắt đầu học thôi!</span></div>`;
  const wrongBox = nW ? `<div class="banner warn">${ic('alert')}<span><b>${nW}</b> câu trong Sổ lỗi sai.</span><a class="btn ghost" href="#/wrong">Làm lại</a></div>` : '';
  const step = (n, ok) => `<span class="step ${ok ? 'done' : ''}">${ok ? ic('check') : n}</span>`;
  if (k === 'learn') {
    const { v, g, r } = byDay(d);
    if (!v.length && !g.length) body = `<div class="card">Nội dung ngày này đang được soạn.</div>`;
    else body = review + `
      <details class="sec" open><summary>${step(1, done)}Từ vựng <span class="muted">· ${v.length} từ</span></summary><div class="body">
        <p class="sub">Bấm loa để nghe rồi đọc to theo, che nghĩa và tự nhớ lại. Đọc kỹ ví dụ và mẹo nhớ.</p>${v.map(vocabHTML).join('')}</div></details>
      <details class="sec" open><summary>${step(2, done)}Ngữ pháp <span class="muted">· ${g.length} mẫu</span></summary><div class="body">${g.map(grammarHTML).join('')}</div></details>
      ${r.length ? `<details class="sec" open><summary>${step(3, done)}Đọc hiểu</summary><div class="body">${r.map(x => `<div class="card">
        <h2>${esc(x.t)}</h2><div class="passage jp">${jp(x.text)}</div>
        <details><summary class="muted">Bản dịch (nên xem sau khi làm quiz)</summary><p>${fmt(x.vi)}</p></details></div>`).join('')}
        <p class="sub">Câu hỏi đọc hiểu nằm cuối bài quiz.</p></div></details>` : ''}
      <div class="card"><h2 class="row">${step(r.length ? 4 : 3, done)}Quiz cuối ngày</h2>
        <p class="muted">${v.length + g.reduce((s, x) => s + x.q.length, 0) + r.reduce((s, x) => s + x.qs.length, 0)} câu, có giải thích ngay sau mỗi câu. Hoàn thành quiz = xong ngày, từ và ngữ pháp tự vào flashcard.</p>
        <button class="btn" onclick="runDay(${d})">${done ? 'Làm lại quiz' : 'Bắt đầu quiz'}${ic('right')}</button></div>`;
  } else if (k === 'week') {
    body = review + wrongBox + `<div class="card"><h2>Quiz ôn tuần</h2><p class="muted">30 câu từ vựng và ngữ pháp của ngày ${d - 6}–${d - 1}. Hôm nay không học mới.</p>
      <button class="btn" onclick="runDay(${d})">Bắt đầu</button></div>`;
  } else if (k === 'total') {
    body = review + wrongBox + `<div class="card"><h2>Quiz tổng ôn</h2><p class="muted">30 câu, ưu tiên câu bạn hay sai và thẻ hay quên.</p>
      <button class="btn" onclick="runDay(${d})">Bắt đầu</button></div>`;
  } else {
    body = review + `<div class="card"><h2>Đề thi thử</h2><p class="muted">Cấu trúc gần giống JLPT N4: 25 câu 文字・語彙, 15 câu 文法, 3 bài 読解. Thời gian 80 phút. Đáp án và giải thích hiện sau khi nộp bài. Mỗi lần làm là một đề ngẫu nhiên mới.</p>
      <button class="btn" onclick="runDay(${d})">Bắt đầu thi</button></div>`;
  }
  $('#app').innerHTML = `
    <p class="sub">${isToday ? '<b>Hôm nay</b> · ' : ''}Dự kiến ${dateOf(S.start + d - 1)}${done ? ` · <span style="color:var(--ok)">Đã xong ${done.s}/${done.n}</span>` : ''}</p>
    <h1>${ic(icon)}Ngày ${d}/${TOTAL}: ${label}</h1>
    <div class="row" style="margin:6px 0 16px">${d > 1 ? `<a class="btn ghost" href="#/day/${d - 1}" aria-label="Ngày trước">${ic('left')}${d - 1}</a>` : ''}${d < TOTAL ? `<a class="btn ghost push" href="#/day/${d + 1}" aria-label="Ngày sau">${d + 1}${ic('right')}</a>` : ''}</div>
    ${body}`;
}
function runDay(d) {
  const k = kind(d);
  const make = { learn: () => dayQuiz(d), week: () => weekQuiz(d), total: totalQuiz, mock: mockQuiz }[k];
  startQuiz(`Ngày ${d}: ${KIND[k][1]}`, make(), {
    exam: k === 'mock' ? 80 : 0, back: '#/', redo: make,
    onDone(s, n) {
      S.done[d] = { s, n, at: todayN() };
      const { v, g } = byDay(d), t = todayN() + 1;
      v.forEach(x => { S.srs['v:' + x.w] = S.srs['v:' + x.w] || newCard(t); });
      g.forEach(x => { S.srs['g:' + x.p] = S.srs['g:' + x.p] || newCard(t); });
      bump();
    },
  });
}

function plan() {
  const cur = nextDay();
  let weeks = '';
  for (let w = 0; w < Math.ceil(TOTAL / 7); w++) {
    let cells = '';
    for (let d = w * 7 + 1; d <= Math.min(TOTAL, w * 7 + 7); d++) {
      const k = kind(d), n = byDay(d), done = S.done[d];
      cells += `<a href="#/day/${d}" class="day k-${k} ${done ? 'done' : ''} ${d === cur ? 'cur' : ''}" aria-label="Ngày ${d}: ${KIND[k][1]}${done ? ', đã xong' : ''}" ${d === cur ? 'aria-current="date"' : ''}>
        <b>${d}</b>${ic(done ? 'check' : KIND[k][0])}<span class="sm-hide">${k === 'learn' ? `${n.v.length}t·${n.g.length}np${n.r.length ? '·đ' : ''}` : KIND[k][1]}</span>
        <span class="muted sm-hide">${done ? `${Math.round(done.s / done.n * 100)}%` : dateOf(S.start + d - 1)}</span></a>`;
    }
    weeks += `<div class="week"><h3>Tuần ${w + 1}</h3><div class="days">${cells}</div></div>`;
  }
  $('#app').innerHTML = `<h1>${ic('map')}Lộ trình 60 ngày</h1>
    <p class="sub">Đã xong ${Object.keys(S.done).length}/${TOTAL} ngày. Ngày chưa xong sẽ không bị bỏ qua: "Hôm nay" luôn là ngày chưa hoàn thành đầu tiên.</p>
    <div class="legend"><span>${ic('book')}Học mới ~15 từ + 3 ngữ pháp</span><span>${ic('repeat')}Ôn tuần</span><span>${ic('target')}Tổng ôn (51–56)</span><span>${ic('file')}Thi thử (57–60)</span><span>t = từ · np = ngữ pháp · đ = đọc</span></div>
    ${weeks}
    <div class="card"><h2>Mỗi ngày học như thế nào?</h2><ol>
      <li>Ôn hết thẻ flashcard đến hạn (5–15 phút).</li><li>Học từ mới: nghe, đọc to, đọc ví dụ, đọc mẹo nhớ.</li>
      <li>Học ngữ pháp: thuộc cấu trúc, đọc 3 ví dụ, so sánh mẫu dễ nhầm.</li><li>Đọc hiểu (2 ngày 1 bài).</li>
      <li>Làm quiz cuối ngày. Câu sai tự vào Sổ lỗi sai, từ mới tự vào flashcard.</li></ol></div>`;
}

let RV = null; // phiên ôn flashcard
function review() {
  if (!RV) RV = { q: shuffle(dueIds()), flip: false, n: 0 };
  const app = $('#app');
  if (!RV.q.length) {
    const n = RV.n; RV = null;
    app.innerHTML = `<div class="card empty">${ic('check')}<h2>Hết thẻ đến hạn</h2><p>${n ? `Đã ôn ${n} lượt. ` : ''}Ngày mai có ${dueIds(todayN() + 1).length} thẻ.</p><a class="btn" href="#/">Về bài hôm nay${ic('right')}</a></div>`;
    return;
  }
  const id = RV.q[0], x = itemOf(id), isV = id[0] === 'v';
  if (RV.dir === undefined) RV.dir = Math.random() < 0.5; // true: JP→VI · false: VI→JP
  const front = `<span class="tag">${isV ? 'Từ vựng' : 'Ngữ pháp'} · ${RV.dir ? 'Nhật → Việt' : 'Việt → Nhật'}</span>` + (RV.dir
    ? (isV ? `<div class="w">${esc(x.w)}</div>` : `<div class="w">${jp(x.p)}</div>`) + '<p class="muted">Nghĩa là gì?</p>'
    : `<div class="big2"><b>${esc(x.m)}</b></div>${isV ? `<div class="t">${TYPE[x.t] || ''}</div>` : ''}<p class="muted">Tiếng Nhật là gì?</p>`);
  const back = isV
    ? `<div class="w">${esc(x.w)}</div><div class="k">${esc(x.k)} ${say(x.k)}</div><div class="m">${x.hv ? `<span class="hv">${esc(x.hv)}</span>` : ''}${esc(x.m)}</div>${x.ex.map(exHTML).join('')}${x.n ? note('bulb', x.n) : ''}`
    : `<div class="w">${jp(x.p)}</div><div class="m"><b>${esc(x.m)}</b></div><div class="form">${jp(x.f)}</div>${x.ex.slice(0, 2).map(exHTML).join('')}`;
  const c = S.srs[id], t = todayN();
  const lbl = ['Quên', 'Khó', 'Được', 'Dễ'];
  app.innerHTML = `<div class="qhead"><span>Ôn flashcard · đã ôn <b>${RV.n}</b></span><span>Còn <b>${RV.q.length}</b> thẻ</span></div>
    <div class="card fc" aria-live="polite">${RV.flip ? back : front}</div>
    ${RV.flip
      ? `<p class="sub" style="text-align:center">Bạn nhớ thẻ này thế nào? (số ngày = lần ôn kế tiếp)</p><div class="grades">${lbl.map((l, g) => `<button class="g${g}" onclick="rate(${g})">${l}<small>${grade(c, g, t).int} ngày<span class="hint"> · <kbd>${g + 1}</kbd></span></small></button>`).join('')}</div>`
      : `<button class="btn block" id="flip" onclick="RV.flip=true;review()">Lật thẻ <kbd class="hint">Space</kbd></button>`}`;
  const f = $('#flip') || $('.grades button.g2'); if (f) f.focus({ preventScroll: true });
  if (!RV.flip && RV.dir && isV) speak(x.k);
}
function rate(g) {
  const id = RV.q.shift();
  S.srs[id] = grade(S.srs[id], g, todayN());
  if (g === 0) RV.q.push(id); // quên → gặp lại trong phiên
  RV.flip = false; RV.dir = undefined; RV.n++;
  bump(); save(); review();
}

function cards() {
  const ids = Object.keys(S.srs), t = todayN();
  const learned = ids.filter(id => S.srs[id].int >= LEARNED).length;
  $('#app').innerHTML = `<h1>${ic('cards')}Flashcard</h1>
    <div class="stats">
      <div class="stat"><b>${dueIds().length}</b><span>đến hạn hôm nay</span></div>
      <div class="stat"><b>${dueIds(t + 1).length}</b><span>đến hạn ngày mai</span></div>
      <div class="stat"><b>${ids.length}</b><span>tổng số thẻ</span></div>
      <div class="stat"><b>${learned}</b><span>đã thuộc (≥${LEARNED} ngày)</span></div></div>
    <a class="btn" href="#/review">Ôn ngay (${dueIds().length})${ic('right')}</a>
    <p class="sub" style="margin-top:12px">Thẻ hiện ngẫu nhiên theo 2 chiều: Nhật→Việt và Việt→Nhật. Cố nhớ lại trước khi lật thẻ, và chấm thật lòng: chọn "Quên" thì thẻ quay lại ngay trong phiên.</p>
    <h2 style="margin:20px 0 8px">Kho từ & ngữ pháp</h2>
    <label class="lbl" for="q">Tìm theo từ, cách đọc, nghĩa hoặc âm Hán Việt</label>
    <input type="search" id="q" placeholder="vd: 届ける, とどける, gửi, GIỚI, ようにする" oninput="clearTimeout(lib.h);lib.h=setTimeout(()=>lib(this.value),150)">
    <div class="list" id="lib"></div>`;
  lib('');
}
function lib(s) {
  s = s.trim().toLowerCase();
  const hit = x => !s || [x.w, x.k, x.m, x.p, x.hv].some(v => v && v.toLowerCase().includes(s));
  const rows = [
    ...DATA.vocab.filter(hit).map(x => `<div class="item"><div class="grow"><b>${esc(x.w)}</b> <span class="muted">${esc(x.k)}</span> · ${esc(x.m)} <span class="t">N${x.day}</span></div>${say(x.k)}${addBtn('v:' + x.w)}</div>`),
    ...DATA.grammar.filter(hit).map(x => `<div class="item"><div class="grow"><b>${jp(x.p)}</b> · ${esc(x.m)} <span class="t">N${x.day}</span></div>${addBtn('g:' + x.p)}</div>`),
  ];
  $('#lib').innerHTML = rows.slice(0, 200).join('') + (rows.length > 200 ? `<p class="muted">… còn ${rows.length - 200} mục, gõ để lọc thêm.</p>` : '') || '<p class="empty">Không tìm thấy. Thử từ khoá khác.</p>';
}

function wrong() {
  const ids = Object.entries(S.wrong).sort((a, b) => b[1].n - a[1].n);
  const label = id => { const r = id.slice(id.indexOf(':') + 1); return esc(r.replace(/#\d+$/, '')); };
  const sec = { v: 'Từ vựng', g: 'Ngữ pháp', r: 'Đọc' };
  $('#app').innerHTML = `<h1>${ic('alert')}Sổ lỗi sai</h1>
    <p class="sub">Câu làm sai sẽ tự lưu vào đây. Trả lời đúng 2 lần liên tiếp thì câu đó được xoá khỏi sổ.</p>
    ${ids.length ? `<button class="btn" onclick="runWrong()">${ic('repeat')}Làm lại ${ids.length} câu</button>` : ''}
    <div class="list" style="margin-top:12px">${ids.map(([id, w]) => `<div class="item"><div class="grow"><b>${label(id)}</b> <span class="t">${sec[id[0]]}</span></div>
      <span class="muted">sai ${w.n} lần · đúng ${w.ok}/2</span></div>`).join('') || `<div class="empty">${ic('check')}<p>Chưa có câu sai nào. Làm quiz cuối ngày, câu sai sẽ tự lưu vào đây.</p></div>`}</div>`;
}
function runWrong() {
  const make = () => shuffle(Object.keys(S.wrong).map(qFromId).filter(Boolean));
  startQuiz('Làm lại câu sai', make(), { back: '#/wrong', redo: make });
}

function stats() {
  const ids = Object.keys(S.srs), t = todayN();
  const vLearned = ids.filter(id => id[0] === 'v' && S.srs[id].int >= LEARNED).length;
  const pct = ([a, b]) => b ? Math.round(a / b * 100) + '%' : '–';
  const fore = [...Array(7)].map((_, i) => ids.filter(id => i ? S.srs[id].due === t + i : S.srs[id].due <= t).length);
  const max = Math.max(1, ...fore);
  $('#app').innerHTML = `<h1>${ic('chart')}Thống kê</h1>
    <div class="stats">
      <div class="stat"><b style="color:var(--accent)">${S.streak.last >= t - 1 ? S.streak.n : 0}</b><span>ngày học liên tiếp</span></div>
      <div class="stat"><b>${Object.keys(S.done).length}/${TOTAL}</b><span>ngày đã xong</span></div>
      <div class="stat"><b>${vLearned}/${DATA.vocab.length}</b><span>từ đã thuộc</span></div>
      <div class="stat"><b>${ids.length}</b><span>thẻ đang học</span></div>
      <div class="stat"><b>${pct(S.stat.v)}</b><span>đúng: từ vựng</span></div>
      <div class="stat"><b>${pct(S.stat.g)}</b><span>đúng: ngữ pháp</span></div>
      <div class="stat"><b>${pct(S.stat.r)}</b><span>đúng: đọc hiểu</span></div>
      <div class="stat"><b>${Object.keys(S.wrong).length}</b><span>câu trong sổ lỗi</span></div></div>
    <div class="card"><h2>Số thẻ cần ôn 7 ngày tới</h2><div class="fore" role="img" aria-label="Số thẻ đến hạn: ${fore.join(', ')}">${fore.map((n, i) => `<div><b>${n}</b><i style="height:${n / max * 80}px"></i>${i ? '+' + i + 'n' : 'Hôm nay'}</div>`).join('')}</div></div>
    <div class="card"><h2>Cài đặt & sao lưu</h2>
      <label class="lbl" for="start">Ngày bắt đầu lộ trình</label><input id="start" type="date" value="${new Date(S.start * 864e5).toISOString().slice(0, 10)}" onchange="setStart(this.value)">
      <p class="muted">Tiến độ lưu trong trình duyệt (localStorage). Xoá dữ liệu trình duyệt hay đổi máy sẽ mất tiến độ, nên thỉnh thoảng hãy xuất file sao lưu.</p>
      <div class="row"><button class="btn" onclick="exportData()">${ic('down')}Xuất file</button>
        <label class="btn ghost" tabindex="0" onkeydown="if(event.key==='Enter')this.click()">${ic('up')}Nhập file<input type="file" accept=".json" hidden onchange="importData(this.files[0])"></label>
        <button class="btn danger push" onclick="resetAll()">Xoá toàn bộ</button></div></div>`;
}
function setStart(v) { if (v) { S.start = Math.floor(Date.parse(v) / 864e5); save(); toast('Đã đổi ngày bắt đầu'); } }
function exportData() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' }));
  a.download = `n4-tien-do-${new Date().toISOString().slice(0, 10)}.json`;
  a.click(); URL.revokeObjectURL(a.href);
}
function importData(f) {
  if (!f) return;
  f.text().then(t => {
    const o = JSON.parse(t);
    if (!o || typeof o.srs !== 'object' || typeof o.done !== 'object') throw new Error('file không đúng định dạng');
    S = { ...blank(), ...o }; save(); toast('✅ Đã nhập tiến độ'); route();
  }).catch(e => toast('⚠️ Không nhập được: ' + e.message));
}
function resetAll() {
  // ponytail: dùng confirm() gốc, đủ cho thao tác hiếm
  if (confirm('Xoá toàn bộ tiến độ? Nên xuất file sao lưu trước.')) { S = blank(); save(); route(); }
}

/* ====== Router & sự kiện ====== */
function route() {
  clearTimeout(timer);
  const [, v = '', a] = location.hash.split('/');
  if (v !== 'review') RV = null;
  ({ '': home, day: () => dayView(+a, +a === nextDay()), plan, cards, review, wrong, stats, quiz: quizView }[v] || home)();
  document.querySelectorAll('nav a').forEach(n => n.classList.toggle('on', n.dataset.v === v));
  const on = S.streak.last >= todayN() - 1 && S.streak.n;
  $('#streak').innerHTML = on ? `${ic('flame')}${S.streak.n}` : '';
  $('#prog i').style.width = Object.keys(S.done).length / TOTAL * 100 + '%';
  $('#prog').title = `Đã xong ${Object.keys(S.done).length}/${TOTAL} ngày`;
  scrollTo(0, 0);
  if (route.n++) $('#app').focus({ preventScroll: true }); // trình đọc màn hình: chuyển focus về nội dung mới
}
route.n = 0;
function boot() {
  document.querySelectorAll('nav a').forEach(a => a.insertAdjacentHTML('afterbegin', ic(a.dataset.i)));
  const furi = () => { document.body.classList.toggle('nofuri', !S.set.furi); $('#furi').classList.toggle('off', !S.set.furi); $('#furi').setAttribute('aria-pressed', S.set.furi); };
  furi();
  $('#furi').onclick = () => { S.set.furi = !S.set.furi; save(); furi(); toast(S.set.furi ? 'Đã bật furigana' : 'Đã tắt furigana'); };
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-say]'); if (s) return speak(s.dataset.say);
    const b = e.target.closest('[data-add]');
    if (b) {
      const id = b.dataset.add;
      if (S.srs[id]) { delete S.srs[id]; toast('Đã bỏ khỏi flashcard'); }
      else { S.srs[id] = newCard(todayN()); toast('Đã thêm vào flashcard'); }
      save(); b.outerHTML = addBtn(id);
    }
  });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    const v = location.hash.split('/')[1];
    if (v === 'quiz' && Q && Q.i < Q.list.length) {
      const n = +e.key;
      if (n >= 1 && n <= Q.list[Q.i].c.length) pick(n - 1);
      else if (e.key === 'Enter' && Q.picked[Q.i] !== undefined) nextQ();
    } else if (v === 'review' && RV && RV.q.length) {
      if (e.key === ' ' && !RV.flip) { e.preventDefault(); RV.flip = true; review(); }
      else if (RV.flip && e.key >= '1' && e.key <= '4') rate(+e.key - 1);
    }
  });
  addEventListener('hashchange', route);
  route();
}
if (typeof document !== 'undefined') boot();
