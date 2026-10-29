// Codex(내장 imagegen)에게 이미지 "생성만" 맡기고, 끝나면 결과 요약을 남깁니다.
// 사용: node scripts/image-tools/run-codex.mjs <작업이름> <요청문.txt>
// 결과: _workspace/img-jobs/<작업이름>.result.json (생성 파일 경로 포함) — 저장·변환은 place-images.mjs 로 합니다.
import { spawn, execSync } from 'node:child_process';
import { readFileSync, writeFileSync, createWriteStream, readdirSync, statSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';

const [name, promptFile] = process.argv.slice(2);
if (!name || !promptFile) { console.error('사용: node run-codex.mjs <작업이름> <요청문.txt>'); process.exit(1); }
const dir = 'D:/www/mypages/_workspace/img-jobs';
mkdirSync(dir, { recursive: true });

// Codex가 업데이트되면 폴더 이름이 바뀌므로, codex.exe가 있는 가장 최근 폴더를 찾습니다.
const BIN = `${homedir().replace(/\\/g, '/')}/AppData/Local/OpenAI/Codex/bin`;
const CODEX = readdirSync(BIN).map((d) => `${BIN}/${d}/codex.exe`)
  .filter((f) => { try { return statSync(f).isFile(); } catch { return false; } })
  .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
if (!CODEX) { console.error('codex.exe 를 찾지 못했습니다.'); process.exit(1); }

const log = createWriteStream(`${dir}/${name}.jsonl`);
const started = Date.now();
const child = spawn(CODEX, ['exec', '-s', 'workspace-write', '-C', 'D:/www/mypages', '--json', '-'], { stdio: ['pipe', 'pipe', 'pipe'] });
let buffer = ''; let threadId = ''; let last = ''; let done = false;

const finish = (why) => {
  if (done) return; done = true;
  try { execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: 'ignore' }); } catch { /* 이미 종료 */ }
  const gen = threadId ? `${homedir().replace(/\\/g, '/')}/.codex/generated_images/${threadId}` : '';
  let files = [];
  try { files = readdirSync(gen).map((f) => ({ f, size: statSync(`${gen}/${f}`).size, t: statSync(`${gen}/${f}`).mtimeMs })).sort((a, b) => a.t - b.t); } catch { /* 폴더 없음 */ }
  writeFileSync(`${dir}/${name}.result.json`, JSON.stringify({ name, why, seconds: Math.round((Date.now() - started) / 1000), threadId, generatedDir: gen, files, lastMessage: last }, null, 2));
  console.log(`[${name}] ${why} · ${Math.round((Date.now() - started) / 1000)}초 · 생성 파일 ${files.length}개`);
  process.exit(0);
};

child.stdout.on('data', (chunk) => {
  log.write(chunk); buffer += chunk.toString();
  let i;
  while ((i = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, i).trim(); buffer = buffer.slice(i + 1);
    try {
      const j = JSON.parse(line);
      if (j.type === 'thread.started') threadId = j.thread_id;
      if (j.item?.type === 'agent_message') last = j.item.text;
      if (j.type === 'turn.completed') setTimeout(() => finish('완료'), 1500);
      if (j.type === 'turn.failed' || j.type === 'error') finish('오류: ' + JSON.stringify(j).slice(0, 300));
    } catch { /* JSON 아닌 줄 */ }
  }
});
child.stderr.on('data', (chunk) => log.write(chunk));
child.on('exit', () => setTimeout(() => finish('프로세스 종료'), 2000));
setTimeout(() => finish('시간 초과(40분)'), 40 * 60 * 1000);
child.stdin.write(readFileSync(promptFile, 'utf8'));
child.stdin.end();
