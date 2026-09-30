import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, LogOut, Mail, Phone, RefreshCw, Search } from 'lucide-react';
import { withBasePath } from '../lib/appPaths.js';
import './admin.css';

// 나나웹 문의 관리자 (/admin). 문의 목록·상세·상태·메모를 관리합니다.
const TOKEN_KEY = 'nanaweb-admin-token';
const STATUS = Object.freeze({ new: '새 문의', progress: '진행 중', done: '완료' });
const FILTERS = Object.freeze([['all', '전체'], ['new', '새 문의'], ['progress', '진행 중'], ['done', '완료']]);

const storage = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } },
  set: (value) => { try { localStorage.setItem(TOKEN_KEY, value); } catch { /* 저장 불가 환경 */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* 저장 불가 환경 */ } },
};

async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(withBasePath(path), {
    method,
    headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.message || '요청을 처리하지 못했습니다.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

const formatTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [state, setState] = useState({ pending: false, error: '' });
  const submit = async (event) => {
    event.preventDefault();
    setState({ pending: true, error: '' });
    try {
      const payload = await api('/api/admin/login', { method: 'POST', body: form });
      onLogin(payload.token);
    } catch (error) {
      setState({ pending: false, error: error.message });
    }
  };
  return (
    <main className="ad-login">
      <form className="ad-login__card" onSubmit={submit}>
        <p className="ad-brand">나나웹 <span>관리자</span></p>
        <h1>문의 관리</h1>
        <label>아이디<input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} autoComplete="username" required /></label>
        <label>비밀번호<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" required /></label>
        {state.error ? <p className="ad-error" role="alert">{state.error}</p> : null}
        <button type="submit" className="ad-btn" disabled={state.pending}>{state.pending ? '확인 중…' : '로그인'}</button>
        <a className="ad-back" href={withBasePath('/')}>← 나나웹 홈</a>
      </form>
    </main>
  );
}

function Detail({ item, token, onSaved, onBack }) {
  const [memo, setMemo] = useState(item.memo || '');
  const [saving, setSaving] = useState('');
  const [copied, setCopied] = useState(false);
  const save = async (patch, label) => {
    setSaving(label);
    try {
      const payload = await api('/api/admin/inquiries', { token, method: 'PATCH', body: { id: item.id, ...patch } });
      onSaved(payload.inquiry);
    } catch (error) {
      window.alert(error.message);
    } finally {
      setSaving('');
    }
  };
  const copy = async () => {
    const text = [`[나나웹 문의] ${item.contactName}`, `회사: ${item.sampleBrand || '-'}`, `연락처: ${item.phone || '-'} / ${item.email || '-'}`, `예산: ${item.budget || '-'} · 시기: ${item.timeline || '-'}`, '', item.details].join('\n');
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { window.alert('복사하지 못했습니다.'); }
  };
  return (
    <article className="ad-detail">
      <button type="button" className="ad-detail__back" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" /> 목록</button>
      <header>
        <p className={`ad-pill ad-pill--${item.status}`}>{STATUS[item.status] || STATUS.new}</p>
        <h2>{item.contactName}<small>{item.sampleBrand}</small></h2>
        <p className="ad-muted">{formatTime(item.createdAt)} 접수</p>
      </header>
      <div className="ad-contact">
        {item.phone ? <a className="ad-btn ad-btn--line" href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}><Phone size={16} aria-hidden="true" />{item.phone}</a> : null}
        {item.email ? <a className="ad-btn ad-btn--line" href={`mailto:${item.email}`}><Mail size={16} aria-hidden="true" />{item.email}</a> : null}
        <button type="button" className="ad-btn ad-btn--line" onClick={copy}><Copy size={16} aria-hidden="true" />{copied ? '복사됨' : '내용 복사'}</button>
      </div>
      <dl className="ad-fields">
        <div><dt>예상 예산</dt><dd>{item.budget || '-'}</dd></div>
        <div><dt>공개 희망 시기</dt><dd>{item.timeline || '-'}</dd></div>
        <div><dt>참고</dt><dd>{item.references || '-'}</dd></div>
        <div><dt>접수 경로</dt><dd>{item.sourcePath || '-'}</dd></div>
      </dl>
      <section className="ad-body"><h3>문의 내용</h3><p>{item.details}</p></section>
      <section className="ad-status">
        <h3>처리 상태</h3>
        <div role="group" aria-label="처리 상태">
          {Object.entries(STATUS).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={item.status === value} disabled={Boolean(saving)} onClick={() => save({ status: value }, value)}>{saving === value ? '저장 중…' : label}</button>
          ))}
        </div>
      </section>
      <section className="ad-memo">
        <h3>메모</h3>
        <textarea value={memo} onChange={(event) => setMemo(event.target.value)} rows={4} placeholder="통화 내용, 다음 할 일 등을 적어 두세요." />
        <button type="button" className="ad-btn" disabled={Boolean(saving) || memo === (item.memo || '')} onClick={() => save({ memo }, 'memo')}>{saving === 'memo' ? '저장 중…' : '메모 저장'}</button>
      </section>
    </article>
  );
}

function Dashboard({ token, onLogout }) {
  const [data, setData] = useState({ inquiries: [], counts: null });
  const [state, setState] = useState({ loading: true, error: '' });
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }));
    try {
      const payload = await api('/api/admin/inquiries', { token });
      setData({ inquiries: payload.inquiries || [], counts: payload.counts });
      setState({ loading: false, error: '' });
    } catch (error) {
      if (error.status === 401) { onLogout(); return; }
      setState({ loading: false, error: error.message });
    }
  }, [token, onLogout]);

  // 처음 한 번 불러오고, 이후 1분마다 새 문의를 확인합니다.
  useEffect(() => {
    const first = window.setTimeout(load, 0);
    const timer = window.setInterval(load, 60000);
    return () => { window.clearTimeout(first); window.clearInterval(timer); };
  }, [load]);

  useEffect(() => {
    const count = data.counts?.new || 0;
    document.title = count ? `(${count}) 문의 관리 — 나나웹` : '문의 관리 — 나나웹';
  }, [data.counts]);

  const list = useMemo(() => {
    const text = query.trim().toLowerCase();
    return data.inquiries.filter((item) => (filter === 'all' || item.status === filter)
      && (!text || [item.contactName, item.sampleBrand, item.phone, item.email, item.details].some((value) => String(value || '').toLowerCase().includes(text))));
  }, [data.inquiries, filter, query]);
  const selected = data.inquiries.find((item) => item.id === selectedId);

  const onSaved = (updated) => {
    setData((current) => {
      const inquiries = current.inquiries.map((item) => (item.id === updated.id ? updated : item));
      const counts = { total: inquiries.length, new: 0, progress: 0, done: 0 };
      inquiries.forEach((item) => { counts[item.status] = (counts[item.status] || 0) + 1; });
      return { inquiries, counts };
    });
  };

  return (
    <div className={`ad${selected ? ' has-selection' : ''}`}>
      <header className="ad-top">
        <p className="ad-brand">나나웹 <span>문의 관리</span></p>
        <div>
          <button type="button" className="ad-icon" onClick={load} aria-label="새로고침"><RefreshCw size={18} className={state.loading ? 'is-spin' : ''} /></button>
          <button type="button" className="ad-icon" onClick={onLogout} aria-label="로그아웃"><LogOut size={18} /></button>
        </div>
      </header>
      <section className="ad-counts" aria-label="문의 현황">
        {FILTERS.map(([value, label]) => (
          <button key={value} type="button" className={filter === value ? 'is-on' : ''} onClick={() => setFilter(value)}>
            <span>{label}</span><b>{value === 'all' ? data.counts?.total ?? 0 : data.counts?.[value] ?? 0}</b>
          </button>
        ))}
      </section>
      {state.error ? <p className="ad-error ad-error--bar" role="alert">{state.error}</p> : null}
      <div className="ad-main">
        <section className="ad-list" aria-label="문의 목록">
          <label className="ad-search"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 회사, 연락처, 내용 검색" /></label>
          {list.length ? (
            <ul>
              {list.map((item) => (
                <li key={item.id}>
                  <button type="button" aria-current={item.id === selectedId} onClick={() => setSelectedId(item.id)}>
                    <span className={`ad-dot ad-dot--${item.status}`} aria-hidden="true" />
                    <span className="ad-list__main"><b>{item.contactName}</b><small>{item.sampleBrand}</small><em>{item.details}</em></span>
                    <span className="ad-list__time">{formatTime(item.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ad-empty">{state.loading ? '불러오는 중…' : '해당하는 문의가 없습니다.'}</p>
          )}
        </section>
        <section className="ad-panel" aria-live="polite">
          {selected ? <Detail key={selected.id} item={selected} token={token} onSaved={onSaved} onBack={() => setSelectedId('')} /> : <p className="ad-empty">왼쪽에서 문의를 선택하세요.</p>}
        </section>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState(storage.get);
  const logout = useCallback(() => { storage.clear(); setToken(''); }, []);
  if (!token) return <Login onLogin={(value) => { storage.set(value); setToken(value); }} />;
  return <Dashboard token={token} onLogout={logout} />;
}
