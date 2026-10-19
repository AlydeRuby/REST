import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { once } from 'node:events';
import { createRestServer } from '../skills/rest/scripts/serve.mjs';
const app = new URL('../skills/rest/assets/app/', import.meta.url);
test('app loads only bundled assets and declares no outbound connections', async () => {
  const files = await readdir(app);
  const html = await readFile(new URL('index.html', app), 'utf8');
  assert.match(html, /lang="zh-Hant"/);
  assert.match(html, /connect-src 'none'/);
  for (const file of files.filter(f => /\.(js|css|html)$/.test(f))) {
    const text = await readFile(new URL(file, app), 'utf8');
    assert.doesNotMatch(text, /\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|getUserMedia)\b/);
    for (const [, target] of text.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) assert.ok(files.includes(target.slice(2)), `${file}: missing ${target}`);
  }
});
test('preview serves assets, rejects writes, and handles missing files', async t => {
  const server = createRestServer();
  t.after(() => { server.closeAllConnections(); server.close(); });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /休養小室/);
  const script = await fetch(`${base}/app.js`);
  assert.match(script.headers.get('content-type'), /javascript/);
  assert.equal((await fetch(`${base}/not-found`)).status, 404);
  assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 405);
});
test('skill is self-contained with valid required manifest and executable server', async () => {
  const text = await readFile(new URL('../skills/rest/SKILL.md', import.meta.url), 'utf8');
  assert.match(text, /^---\nname: rest\ndescription: .+\n---\n/);
  assert.doesNotMatch(text, /TODO|TBD|\[INSERT/);
  assert.ok((await readFile(new URL('../skills/rest/scripts/serve.mjs', import.meta.url), 'utf8')).includes('../assets/app/'));
});
