// node check.js: kiểm tra dữ liệu + SRS + sinh câu hỏi
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const ctx = vm.createContext({ console });
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], ctx);
const files = [...html.matchAll(/src="(data\/[^"]+)"/g)].map(m => m[1]);
for (const f of files) if (fs.existsSync(__dirname + '/' + f)) vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx, { filename: f });
vm.runInContext(fs.readFileSync(__dirname + '/app.js', 'utf8'), ctx);
const { DATA } = ctx; ctx.esc = vm.runInContext("esc", ctx); // const không gắn vào ctx
const err = [];
const ok = (c, m) => { if (!c) err.push(m); };
const furi = s => { const t = s.replace(/\{[^|}]+\|[^}]+\}/g, ''); return !/[{}|]/.test(t); };

const seen = new Set();
for (const x of DATA.vocab) {
  const id = 'v:' + x.w;
  ok(!seen.has(id), `trùng từ ${x.w}`); seen.add(id);
  ok(x.w && x.k && x.m && x.t, `${x.w}: thiếu w/k/m/t`);
  ok(['n', 'v1', 'v2', 'v3', 'i', 'na', 'adv', 'x'].includes(x.t), `${x.w}: loại từ ${x.t}`);
  ok(x.day >= 1 && x.day <= 50 && x.day % 7, `${x.w}: ngày ${x.day} không phải ngày học`);
  ok(Array.isArray(x.ex) && x.ex.length >= 2 && x.ex.every(e => e[0] && e[1] && furi(e[0])), `${x.w}: ví dụ lỗi`);
  ok(/\*.+?\*/.test(x.ex[0][0]), `${x.w}: ex[0] thiếu *từ đích*`);
}
for (const x of DATA.grammar) {
  ok(!seen.has('g:' + x.p), `trùng mẫu ${x.p}`); seen.add('g:' + x.p);
  ok(x.p && x.m && x.f && x.e && x.ex.length >= 3, `${x.p}: thiếu trường`);
  ok(x.ex.every(e => e[0] && e[1] && furi(e[0])), `${x.p}: ví dụ lỗi`);
  ok(x.q.length >= 2, `${x.p}: cần ≥2 câu quiz`);
}
const rs = new Set();
for (const x of DATA.reading) { ok(!rs.has(x.t), `trùng bài đọc ${x.t}`); rs.add(x.t); ok(x.text && x.vi && x.qs.length, `${x.t}: thiếu trường`); ok(furi(x.text), `${x.t}: furigana lỗi`); }
for (const [o, w] of [...DATA.grammar.flatMap(x => x.q.map(q => [q, x.p])), ...DATA.reading.flatMap(x => x.qs.map(q => [q, x.t]))]) {
  ok(o.c.length === 4 && new Set(o.c).size === 4, `${w}: cần 4 phương án khác nhau: ${o.q}`);
  ok(Number.isInteger(o.a) && o.a >= 0 && o.a < 4, `${w}: đáp án sai chỉ số`);
  ok(o.w && o.w.length > 20, `${w}: thiếu giải thích`);
  ok(furi(o.q) && o.c.every(furi), `${w}: furigana lỗi`);
}

// Sinh câu hỏi: mọi từ, mọi loại → 4 phương án duy nhất, đáp án đúng chỉ số
for (const x of DATA.vocab) for (const t of x.w !== x.k ? 'rmf' : 'mf') {
  const q = ctx.vq(t, x);
  ok(q.c.length === 4 && new Set(q.c).size === 4 && q.c[q.a] === ctx.esc({ r: x.k, m: x.m, f: x.w }[t]), `vq ${t} ${x.w}`);
  ok(ctx.qFromId(q.id), `qFromId ${q.id}`);
}
for (const x of DATA.grammar) x.q.forEach((_, i) => ok(ctx.qFromId(`g:${x.p}#${i}`), `qFromId g ${x.p}`));

// SRS
const g = (c, s) => ctx.grade(c, s, 100);
let c = g(undefined, 2); assert.equal(c.int, 1); c = g(c, 2); assert.equal(c.int, 3); c = g(c, 2); assert.equal(c.int, 8);
assert.equal(g(c, 0).int, 1); assert.ok(g(c, 0).ef < c.ef);
assert.ok(g(c, 3).int > g(c, 2).int && g(c, 2).int > g(c, 1).int);
assert.equal(g(c, 2).due, 100 + g(c, 2).int);
assert.ok(g({ ef: 1.3, int: 5 }, 0).ef >= 1.3);

const days = new Set(DATA.vocab.map(x => x.day));
console.log(`Từ vựng ${DATA.vocab.length} · Ngữ pháp ${DATA.grammar.length} · Bài đọc ${DATA.reading.length} · Ngày có nội dung ${days.size}/43`);
if (err.length) { console.error('LỖI:\n- ' + err.join('\n- ')); process.exit(1); }
console.log('OK');
