// Sunra AI(GPT Image)로 이미지를 만들어 저장합니다.
// 사용: node scripts/image-tools/sunra-image.mjs <저장경로.png> <요청문.txt> [모델경로]
// 키: .env.local 의 SUNRA_KEY (저장소에 올라가지 않음). 키 값은 화면에 출력하지 않습니다.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [out, promptFile, model = 'openai/gpt-image-2/text-to-image'] = process.argv.slice(2);
if (!out || !promptFile) { console.error('사용: node sunra-image.mjs <저장경로.png> <요청문.txt> [모델경로]'); process.exit(1); }

let key = process.env.SUNRA_KEY;
if (!key) {
  try { key = readFileSync('D:/www/mypages/.env.local', 'utf8').match(/^SUNRA_KEY=(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, ''); } catch { /* 파일 없음 */ }
}
if (!key) { console.error('.env.local 에 SUNRA_KEY=... 한 줄을 넣어 주세요.'); process.exit(1); }

const API = 'https://api.sunra.ai/v1/queue';
const headers = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' };
const call = async (url, init) => {
  const r = await fetch(url, { headers, ...init });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
};

const body = { prompt: readFileSync(promptFile, 'utf8'), quality: 'high', aspect_ratio: '1:1' };
const job = await call(`${API}/${model}`, { method: 'POST', body: JSON.stringify(body) });
const id = job.request_id;
console.log(`[${out}] 요청 접수 ${id}`);

const started = Date.now();
for (;;) {
  await new Promise((r) => setTimeout(r, 4000));
  const s = await call(`${API}/requests/${id}/status`);
  if (s.status === 'COMPLETED') break;
  if (!['IN_QUEUE', 'IN_PROGRESS'].includes(s.status)) throw new Error('실패: ' + JSON.stringify(s).slice(0, 300));
  if (Date.now() - started > 10 * 60 * 1000) throw new Error('시간 초과(10분)');
}

const result = await call(`${API}/requests/${id}`);
const url = (result.output ?? result).images?.[0]?.url ?? (result.output ?? result).image?.url;
if (!url) throw new Error('결과에서 이미지 주소를 못 찾음: ' + JSON.stringify(result).slice(0, 400));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log(`[${out}] 저장 완료 · ${Math.round((Date.now() - started) / 1000)}초`);
