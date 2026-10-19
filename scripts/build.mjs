import { cp, mkdir } from 'node:fs/promises';
const app = new URL('../skills/rest/assets/app/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
await mkdir(dist, { recursive: true });
await cp(app, dist, { recursive: true });
console.log('Built dist/ — static files, no dependencies.');
