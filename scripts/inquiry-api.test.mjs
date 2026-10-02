// 문의 접수·관리자 API 테스트. 실제 저장소 대신 임시 파일을 씁니다.
// 실행: node --test scripts/inquiry-api.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const dir = await mkdtemp(path.join(tmpdir(), 'nanaweb-inquiry-'));
process.env.INQUIRY_STORAGE_FILE = path.join(dir, 'inquiries.json');
delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.VERCEL;
process.env.ADMIN_USERNAME = 'tester';
process.env.ADMIN_PASSWORD = 'test-password-' + crypto.randomUUID();
process.env.ADMIN_SESSION_SECRET = crypto.randomBytes(48).toString('base64url');

const { default: submit } = await import('../api/inquiries.js');
const { default: login } = await import('../api/admin/login.js');
const { default: admin } = await import('../api/admin/inquiries.js');

// Vercel 함수 형태의 가짜 요청·응답
async function call(handler, { method = 'GET', body, token, url = '/api' } = {}) {
  const req = { method, url, body, headers: token ? { authorization: `Bearer ${token}` } : {} };
  let status = 0; let payload = null;
  const res = { statusCode: 200, setHeader() {}, end(text) { status = this.statusCode; payload = JSON.parse(text); } };
  await handler(req, res);
  return { status, payload };
}

const sample = { sampleId: 'agency-homepage', contactName: '홍길동', phone: '010-1234-5678', details: '홈페이지 제작 문의' };

test('문의 접수 → 새 문의 상태로 저장되고, 응답에 내부 정보가 없다', async () => {
  const { status, payload } = await call(submit, { method: 'POST', body: sample });
  assert.equal(status, 200);
  assert.equal(payload.ok, true);
  assert.ok(payload.id);
  assert.equal(payload.inquiry, undefined);
  assert.equal(payload.storage, undefined);
});

test('필수 항목이 없으면 거부', async () => {
  const { status } = await call(submit, { method: 'POST', body: { sampleId: 'x', contactName: '', details: '' } });
  assert.equal(status, 400);
});

test('로그인 없이·틀린 비밀번호·위조 토큰은 거부', async () => {
  assert.equal((await call(admin)).status, 401);
  assert.equal((await call(login, { method: 'POST', body: { username: 'tester', password: 'wrong' } })).status, 401);
  const forged = Buffer.from(JSON.stringify({ sub: 'tester', exp: 9999999999 })).toString('base64url') + '.forged';
  assert.equal((await call(admin, { token: forged })).status, 401);
});

test('로그인 → 목록 → 상태·메모 변경 → since 필터', async () => {
  const { payload: auth } = await call(login, { method: 'POST', body: { username: 'tester', password: process.env.ADMIN_PASSWORD, client: 'android-app' } });
  assert.ok(auth.token);
  const exp = JSON.parse(Buffer.from(auth.token.split('.')[0], 'base64url').toString()).exp;
  assert.ok(exp - Date.now() / 1000 > 60 * 60 * 24 * 80, '앱 로그인은 약 90일 유지');

  const list = await call(admin, { token: auth.token });
  assert.equal(list.status, 200);
  assert.equal(list.payload.inquiries.length, 1);
  assert.equal(list.payload.inquiries[0].status, 'new');
  assert.equal(list.payload.counts.new, 1);

  const id = list.payload.inquiries[0].id;
  const patched = await call(admin, { method: 'PATCH', token: auth.token, body: { id, status: 'progress', memo: '내일 전화' } });
  assert.equal(patched.status, 200);
  assert.equal(patched.payload.inquiry.status, 'progress');
  assert.equal(patched.payload.inquiry.memo, '내일 전화');
  assert.equal((await call(admin, { method: 'PATCH', token: auth.token, body: { id, status: 'hacked' } })).status, 400);
  assert.equal((await call(admin, { method: 'PATCH', token: auth.token, body: { id: 'nope', status: 'done' } })).status, 404);

  const future = new Date(Date.now() + 60000).toISOString();
  const none = await call(admin, { token: auth.token, url: `/api/admin/inquiries?since=${encodeURIComponent(future)}` });
  assert.equal(none.payload.inquiries.length, 0);
});

test('문의 삭제: 로그인 필요, 없는 문의는 404, 지우면 목록에서 사라짐', async () => {
  const { payload: auth } = await call(login, { method: 'POST', body: { username: 'tester', password: process.env.ADMIN_PASSWORD } });
  await call(submit, { method: 'POST', body: { ...sample, contactName: '삭제대상' } });
  const before = (await call(admin, { token: auth.token })).payload.inquiries;
  const target = before.find((item) => item.contactName === '삭제대상');
  assert.ok(target);
  assert.equal((await call(admin, { method: 'DELETE', url: `/api/admin/inquiries?id=${target.id}` })).status, 401);
  assert.equal((await call(admin, { method: 'DELETE', token: auth.token, url: '/api/admin/inquiries?id=nope' })).status, 404);
  assert.equal((await call(admin, { method: 'DELETE', token: auth.token, url: '/api/admin/inquiries' })).status, 400);
  assert.equal((await call(admin, { method: 'DELETE', token: auth.token, url: `/api/admin/inquiries?id=${target.id}` })).status, 200);
  const after = (await call(admin, { token: auth.token })).payload.inquiries;
  assert.equal(after.length, before.length - 1);
  assert.equal(after.some((item) => item.id === target.id), false);
});

test('보관 기간(1년)이 지난 문의는 목록을 읽을 때 자동으로 지워진다', async () => {
  const file = process.env.INQUIRY_STORAGE_FILE;
  const records = JSON.parse(await readFile(file, 'utf8'));
  const old = new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString();
  const recent = new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString();
  await writeFile(file, JSON.stringify([{ ...records[0], id: 'old-1', createdAt: old }, { ...records[0], id: 'recent-1', createdAt: recent }, ...records]));
  const { payload: auth } = await call(login, { method: 'POST', body: { username: 'tester', password: process.env.ADMIN_PASSWORD } });
  const list = (await call(admin, { token: auth.token })).payload.inquiries;
  assert.equal(list.some((item) => item.id === 'old-1'), false, '1년 지난 문의는 지워짐');
  assert.equal(list.some((item) => item.id === 'recent-1'), true, '1년 안 된 문의는 남음');
  const saved = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(saved.some((item) => item.id === 'old-1'), false, '저장 파일에서도 지워짐');
});

test.after(() => rm(dir, { recursive: true, force: true }));
