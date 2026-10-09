import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, Phone, Plus, Send, X } from 'lucide-react';
import { useSite } from './siteContext.js';
import { useFloatingReady } from './hooks.js';

// 시안 사이트 오른쪽 아래 연락 채널 + AI 상담 챗봇. (실제 채널·상담원과 연결되지 않는 시안용 동작)
// 설정은 src/sites/docks.js 에서 사이트별로 정합니다.

function KakaoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.5c-5 0-9 3.2-9 7.1 0 2.5 1.6 4.7 4.1 5.9l-.9 3.4c-.1.3.3.6.6.4l4-2.6c.4 0 .8.1 1.2.1 5 0 9-3.2 9-7.2S17 3.5 12 3.5Z" /></svg>;
}
function InstaIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" /></svg>;
}
function BlogIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h4.5c2.6 0 4.2 1.2 4.2 3.2 0 1.3-.7 2.2-1.8 2.7 1.5.4 2.4 1.5 2.4 3 0 2.3-1.8 3.6-4.6 3.6H5V4Zm3 4.8h1.2c.9 0 1.4-.4 1.4-1.1s-.5-1-1.4-1H8v2.1Zm0 4.8h1.5c1 0 1.6-.4 1.6-1.2 0-.7-.6-1.2-1.6-1.2H8v2.4Z" /><circle cx="18.5" cy="15.5" r="1.8" fill="currentColor" /></svg>;
}

const CHANNELS = [
  { id: 'kakao', label: '카카오톡 상담', icon: <KakaoIcon /> },
  { id: 'insta', label: '인스타그램', icon: <InstaIcon /> },
  { id: 'blog', label: '블로그', icon: <BlogIcon /> },
];

const normalize = (text) => text.toLowerCase().replace(/\s+/g, '');
function findAnswer(config, question) {
  const q = normalize(question);
  return config.answers.find((item) => item.keys.some((key) => q.includes(normalize(key))));
}

function ChatPanel({ config, onClose }) {
  const { go } = useSite();
  const [messages, setMessages] = useState(() => [{ from: 'bot', text: config.greeting }]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const timer = useRef(0);

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); return () => window.clearTimeout(timer.current); }, []);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, typing]);

  const ask = (question) => {
    const text = question.trim();
    if (!text || typing) return;
    setMessages((list) => [...list, { from: 'me', text }]);
    setDraft('');
    setTyping(true);
    timer.current = window.setTimeout(() => {
      const hit = findAnswer(config, text);
      setMessages((list) => [...list, hit
        ? { from: 'bot', text: hit.text, link: hit.link }
        : { from: 'bot', text: '정확한 답을 찾지 못했어요. 담당자가 직접 안내해 드릴 수 있도록 연결해 드릴게요.', link: config.booking }]);
      setTyping(false);
    }, 650);
  };

  const follow = (link) => { onClose(); go(link.to); };

  return (
    <section className="nw-chat" role="dialog" aria-label={`${config.bot} 채팅`}>
      <header className="nw-chat__head">
        <span className="nw-chat__avatar" aria-hidden="true"><Bot size={18} /></span>
        <div><b>{config.bot}</b><small><i aria-hidden="true" /> 바로 답변해 드려요</small></div>
        <button type="button" onClick={onClose} aria-label="채팅 닫기"><X size={18} aria-hidden="true" /></button>
      </header>
      <div className="nw-chat__log" ref={logRef} aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={`nw-chat__msg is-${message.from}`}>
            <p>{message.text}</p>
            {message.link ? <button type="button" className="nw-chat__link" onClick={() => follow(message.link)}>{message.link.label} →</button> : null}
          </div>
        ))}
        {typing ? <div className="nw-chat__msg is-bot"><p className="nw-chat__typing" aria-label="답변 작성 중"><i /><i /><i /></p></div> : null}
      </div>
      <div className="nw-chat__quick">
        {config.quick.map((question) => <button key={question} type="button" onClick={() => ask(question)}>{question}</button>)}
      </div>
      <form className="nw-chat__form" onSubmit={(event) => { event.preventDefault(); ask(draft); }}>
        <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="궁금한 점을 입력하세요" aria-label="질문 입력" maxLength={200} />
        <button type="submit" aria-label="보내기" disabled={!draft.trim()}><Send size={16} aria-hidden="true" /></button>
      </form>
      <p className="nw-chat__note">시안용 자동 응답입니다. 실제 상담원과 연결되지 않습니다.</p>
    </section>
  );
}

export function FloatingDock({ config }) {
  const [chat, setChat] = useState(false);
  const [more, setMore] = useState(false);
  const [toast, setToast] = useState('');
  const [showTop, setShowTop] = useState(false);
  const toastTimer = useRef(0);
  const ready = useFloatingReady();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.clearTimeout(toastTimer.current); };
  }, []);
  useEffect(() => {
    if (!chat) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setChat(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chat]);

  const notice = (label) => {
    setToast(`${label}은(는) 실제 운영 시 연결됩니다. (시안)`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  };

  if (!config) return null;
  const style = { '--dock-accent': config.accent, '--dock-ink': config.ink };
  return (
    <div className={`nw-dock${more ? ' is-more' : ''}${chat ? ' is-chat' : ''}${ready || chat ? '' : ' is-hidden'}`} style={style}>
      {chat ? <ChatPanel config={config} onClose={() => setChat(false)} /> : null}
      {toast ? <p className="nw-dock__toast" role="status">{toast}</p> : null}
      <div className="nw-dock__stack">
        <button type="button" className={`nw-dock__btn nw-dock__top${showTop ? ' is-on' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="맨 위로" tabIndex={showTop ? 0 : -1}><ArrowUp size={18} aria-hidden="true" /></button>
        <div className="nw-dock__channels" id="nw-dock-channels">
          {CHANNELS.map(({ id, label, icon }) => (
            <button key={id} type="button" className={`nw-dock__btn is-${id}`} onClick={() => notice(label)} aria-label={label} data-tip={label}>{icon}</button>
          ))}
          {config.phone ? <a className="nw-dock__btn is-phone" href={`tel:${config.phone.replace(/-/g, '')}`} aria-label={`전화 ${config.phone}`} data-tip={config.phone}><Phone size={18} aria-hidden="true" /></a> : null}
        </div>
        <button type="button" className="nw-dock__btn nw-dock__more" aria-expanded={more} aria-controls="nw-dock-channels" aria-label={more ? '연락 채널 닫기' : '연락 채널 열기'} onClick={() => setMore((value) => !value)}><Plus size={20} aria-hidden="true" /></button>
        <button type="button" className="nw-dock__chat" aria-expanded={chat} onClick={() => setChat((value) => !value)}>
          {chat ? <X size={22} aria-hidden="true" /> : <Bot size={22} aria-hidden="true" />}<span>AI 상담</span>
        </button>
      </div>
    </div>
  );
}
