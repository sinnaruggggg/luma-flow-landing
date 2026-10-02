import { useCallback, useState } from 'react';
import { ArrowRight, Check, Menu, RotateCcw, X } from 'lucide-react';
import { usePageTitle } from '../_kit/siteContext.js';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { resolvePhoto } from '../_kit/media.js';
import { useFonts, useReveal, useScrolled } from '../_kit/hooks.js';
import { ALL_PHOTO_KEYS, BEANS, BRAND, CADENCES, CONTENTS, GRINDS, PHOTOS, QUIZ, SIZES, STORY, SUBSCRIBE_DISCOUNT } from './content.js';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
  'https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;1,400;1,500&display=swap',
];
const won = (value) => `${Math.round(value / 100) * 100 > 0 ? (Math.round(value / 100) * 100).toLocaleString('ko-KR') : 0}원`;

function Photo({ name, className = '', eager = false }) {
  const { src, alt } = resolvePhoto('ondo-coffee', PHOTOS[name]);
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

function Meter({ label, value }) {
  return (
    <div className="oc-meter">
      <span>{label}</span>
      <i role="img" aria-label={`${label} 5점 중 ${value}점`}>{[1, 2, 3, 4, 5].map((step) => <b key={step} className={step <= value ? 'is-on' : ''} />)}</i>
    </div>
  );
}

function Header() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`oc-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="oc-wrap oc-header__inner">
        <a href="#top" className="oc-logo" aria-label="온도 커피로스터스 처음으로">온도<em>ONDO</em></a>
        <p className="oc-issue">{BRAND.issue}</p>
        <nav className="oc-nav" aria-label="주 메뉴">
          {CONTENTS.filter(([id]) => id !== 'finder').map(([id, , label]) => <a key={id} href={`#${id}`}>{label.replace('이번 달의 ', '').replace(' 만들기', '').replace('성수 로스터리 ', '')}</a>)}
        </nav>
        <a href="#subscribe" className="oc-btn oc-btn--sm oc-header__cta">구독하기</a>
        <button type="button" className="oc-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="oc-drawer">
        <div className="oc-drawer__top"><span className="oc-logo">온도<em>ONDO</em></span><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">{CONTENTS.map(([id, no, label]) => <a key={id} href={`#${id}`} onClick={close}><small>{no}</small>{label}</a>)}</nav>
      </MenuDrawer>
    </header>
  );
}

function Finder({ onPick }) {
  const [answers, setAnswers] = useState({});
  const step = QUIZ.findIndex((item) => !answers[item.id]);
  const done = step === -1;
  let result = null;
  if (done) {
    const id = answers.taste === 'fruit' ? 'guji' : answers.taste === 'sweet' ? 'huila' : 'dusk';
    result = BEANS.find((bean) => bean.id === (answers.milk === 'milk' && id === 'guji' ? 'huila' : id));
  }
  return (
    <section className="oc-section oc-finder" id="finder" aria-labelledby="oc-finder-title">
      <div className="oc-wrap oc-finder__inner">
        <div className="oc-finder__intro" data-reveal>
          <p className="oc-no">02</p>
          <h2 id="oc-finder-title">두 가지 질문으로<br />나에게 맞는 원두 찾기</h2>
          <p>정답은 없습니다. 오늘 끌리는 쪽을 골라 보세요.</p>
        </div>
        <div className="oc-finder__card" aria-live="polite">
          {!done ? (
            <div key={QUIZ[step].id} className="oc-quiz">
              <p className="oc-quiz__count">질문 {step + 1} / {QUIZ.length}</p>
              <h3>{QUIZ[step].question}</h3>
              <div className="oc-quiz__options">
                {QUIZ[step].options.map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setAnswers((current) => ({ ...current, [QUIZ[step].id]: value }))}>{label}<ArrowRight size={18} aria-hidden="true" /></button>
                ))}
              </div>
            </div>
          ) : (
            <div className="oc-result">
              <p className="oc-quiz__count">추천 원두</p>
              <span className="oc-result__swatch" style={{ '--bean': result.color }} aria-hidden="true" />
              <h3>{result.name}</h3>
              <p className="oc-result__mood">{result.mood}</p>
              <p className="oc-result__notes">{result.notes.join(' · ')}</p>
              <div className="oc-result__actions">
                <a href="#subscribe" className="oc-btn" onClick={() => onPick(result.id)}>이 원두로 구독 만들기</a>
                <button type="button" className="oc-link" onClick={() => setAnswers({})}><RotateCcw size={16} aria-hidden="true" /> 다시 하기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Subscribe({ bean, setBean }) {
  const [size, setSize] = useState('200');
  const [cadence, setCadence] = useState('4');
  const [grind, setGrind] = useState('drip');
  const [done, setDone] = useState(false);
  const selected = BEANS.find((item) => item.id === bean) || BEANS[0];
  const factor = SIZES.find(([value]) => value === size)[2];
  const regular = selected.price * factor;
  const perDelivery = regular * (1 - SUBSCRIBE_DISCOUNT);
  const monthly = perDelivery * (cadence === '2' ? 2 : 1);
  const renderGroup = ({ legend, options, value, onChange, name }) => (
    <fieldset className="oc-group">
      <legend>{legend}</legend>
      <div>
        {options.map(([optionValue, label]) => (
          <label key={optionValue} className={value === optionValue ? 'is-on' : ''}>
            <input type="radio" name={name} value={optionValue} checked={value === optionValue} onChange={() => onChange(optionValue)} />{label}
          </label>
        ))}
      </div>
    </fieldset>
  );
  return (
    <section className="oc-section oc-subscribe" id="subscribe" aria-labelledby="oc-sub-title">
      <div className="oc-wrap">
        <div className="oc-sectionhead" data-reveal>
          <p className="oc-no">04</p>
          <h2 id="oc-sub-title">나만의 정기구독 만들기</h2>
          <p>로스팅 후 48시간 안에 발송합니다. 구독하면 언제나 10% 할인, 배송비는 무료예요.</p>
        </div>
        {done ? (
          <div className="oc-subdone" role="status">
            <Check size={28} aria-hidden="true" />
            <h3>구독 설정이 담겼습니다.</h3>
            <p>{selected.name} · {SIZES.find(([value]) => value === size)[1]} · {CADENCES.find(([value]) => value === cadence)[1]} · {GRINDS.find(([value]) => value === grind)[1]}</p>
            <p className="oc-note">※ 시안이라 실제로 결제되거나 배송되지 않습니다.</p>
            <button type="button" className="oc-link" onClick={() => setDone(false)}><RotateCcw size={16} aria-hidden="true" /> 다시 구성하기</button>
          </div>
        ) : (
          <div className="oc-builder">
            <div className="oc-builder__options">
              <fieldset className="oc-group oc-group--beans">
                <legend>원두</legend>
                <div>
                  {BEANS.map((item) => (
                    <label key={item.id} className={bean === item.id ? 'is-on' : ''}>
                      <input type="radio" name="bean" value={item.id} checked={bean === item.id} onChange={() => setBean(item.id)} />
                      <span className="oc-dot" style={{ '--bean': item.color }} aria-hidden="true" />
                      <b>{item.name}</b><small>{item.notes.join(' · ')}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
              {renderGroup({ legend: '용량', options: SIZES.map(([value, label]) => [value, label]), value: size, onChange: setSize, name: 'size' })}
              {renderGroup({ legend: '배송 주기', options: CADENCES, value: cadence, onChange: setCadence, name: 'cadence' })}
              {renderGroup({ legend: '분쇄', options: GRINDS, value: grind, onChange: setGrind, name: 'grind' })}
            </div>
            <aside className="oc-receipt" aria-live="polite">
              <p className="oc-receipt__title">구독 명세서</p>
              <dl>
                <div><dt>원두</dt><dd>{selected.name}</dd></div>
                <div><dt>정가</dt><dd><s>{won(regular)}</s></dd></div>
                <div><dt>1회 배송</dt><dd><b>{won(perDelivery)}</b></dd></div>
                <div><dt>한 달 예상</dt><dd>{won(monthly)}</dd></div>
                <div><dt>배송비</dt><dd>무료</dd></div>
              </dl>
              <button type="button" className="oc-btn oc-btn--full" onClick={() => setDone(true)}>이대로 구독하기</button>
              <p className="oc-receipt__fine">언제든 건너뛰기·해지할 수 있어요.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Site() {
  useFonts(FONTS);
  usePageTitle(`${BRAND.name} — 한 잔의 온도를 맞추는 일`);
  const root = useReveal([]);
  const [bean, setBean] = useState(BEANS[1].id);
  return (
    <div className="oc" ref={root} id="top">
      <Header />
      <main id="site-main" tabIndex={-1}>
        <section className="oc-cover">
          <div className="oc-wrap oc-cover__grid">
            <div className="oc-cover__text">
              <p className="oc-cover__since"><em>{BRAND.since}</em></p>
              <h1>한 잔의<br />온도를 맞추는<br /><span>일.</span></h1>
              <p className="oc-cover__lead">매주 월요일 문을 닫고 볶습니다. 사흘을 쉬게 한 원두만 컵에 담습니다.</p>
              <ol className="oc-toc" aria-label="이번 호 차례">
                {CONTENTS.map(([id, no, label]) => <li key={id}><a href={`#${id}`}><span>{no}</span>{label}</a></li>)}
              </ol>
            </div>
            <figure className="oc-cover__photo">
              <Photo name="roaster" eager />
              <figcaption><em>No. 01</em> 이번 달 첫 로스팅, 콜롬비아 우일라의 냉각 과정.</figcaption>
            </figure>
          </div>
        </section>

        <section className="oc-section" id="beans" aria-labelledby="oc-beans-title">
          <div className="oc-wrap">
            <div className="oc-sectionhead" data-reveal>
              <p className="oc-no">01</p>
              <h2 id="oc-beans-title">이번 달의 원두</h2>
              <p>이번 가을, 세 가지 온도로 준비했습니다.</p>
            </div>
            <ul className="oc-beans">
              {BEANS.map((item, index) => (
                <li key={item.id} data-reveal style={{ '--d': `${index * 110}ms`, '--bean': item.color }}>
                  <div className="oc-bag" aria-hidden="true"><span>ONDO</span><b>{item.english}</b><i>Roast {item.roast}/5</i></div>
                  <p className="oc-beans__process">{item.process} · 200g {item.price.toLocaleString('ko-KR')}원</p>
                  <h3>{item.name}</h3>
                  <p className="oc-beans__notes">{item.notes.map((note) => <span key={note}>{note}</span>)}</p>
                  <div className="oc-beans__meters">
                    <Meter label="산미" value={item.acidity} /><Meter label="단맛" value={item.sweetness} /><Meter label="바디" value={item.body} />
                  </div>
                  <a className="oc-link" href="#subscribe" onClick={() => setBean(item.id)}>이 원두로 구독 <ArrowRight size={16} aria-hidden="true" /></a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Finder onPick={setBean} />

        <section className="oc-section oc-story" id="story" aria-labelledby="oc-story-title">
          <div className="oc-wrap oc-story__grid">
            <figure className="oc-story__photo" data-reveal><Photo name="drip" /><figcaption>로스팅이 끝난 월요일 오후, 첫 잔을 확인하는 시간.</figcaption></figure>
            <div className="oc-story__text">
              <p className="oc-no" data-reveal>03</p>
              <h2 id="oc-story-title" data-reveal>{STORY.title}</h2>
              <div className="oc-columns" data-reveal>{STORY.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <blockquote data-reveal>{STORY.quote}</blockquote>
            </div>
          </div>
          <div className="oc-strip" aria-hidden="true">
            {['bags', 'latte', 'cupping', 'croissant', 'beans', 'plants'].map((name) => <Photo key={name} name={name} />)}
          </div>
        </section>

        <Subscribe bean={bean} setBean={setBean} />

        <section className="oc-section oc-cafe" id="cafe" aria-labelledby="oc-cafe-title">
          <div className="oc-wrap oc-cafe__grid">
            <div data-reveal>
              <p className="oc-no">05</p>
              <h2 id="oc-cafe-title">성수 로스터리 카페</h2>
              <p className="oc-cafe__lead">로스팅 기계 옆에서 그날 볶은 원두를 맛볼 수 있습니다. 원두를 사시면 첫 잔은 무료로 내려 드려요.</p>
              <dl className="oc-cafe__info">
                <div><dt>주소</dt><dd>{BRAND.address}</dd></div>
                <div><dt>영업</dt><dd>{BRAND.hours}</dd></div>
                <div><dt>문의</dt><dd>{BRAND.phone}</dd></div>
              </dl>
            </div>
            <div className="oc-cafe__photos">
              <Photo name="storefront" className="oc-cafe__a" /><Photo name="seats" className="oc-cafe__b" /><Photo name="brick" className="oc-cafe__c" />
            </div>
          </div>
        </section>
      </main>
      <footer className="oc-footer">
        <div className="oc-wrap oc-footer__inner">
          <p className="oc-logo">온도<em>ONDO</em></p>
          <p>{BRAND.english} · {BRAND.address} · 사업자등록번호 000-00-00000 · 통신판매업 신고 제0000-서울성동-0000호</p>
          <p>© 2026 {BRAND.name}. 나나웹이 제작한 가상 업체 시안입니다.</p>
          <PhotoCredits keys={ALL_PHOTO_KEYS} />
        </div>
      </footer>
    </div>
  );
}
