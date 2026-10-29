import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Star, Trash2, Truck, User, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { SitePhoto } from '../_kit/SitePhoto.jsx';
import { useFonts, useReveal, useScrolled } from '../_kit/hooks.js';
import { CATEGORIES, LOOKS, NOTICES, PRODUCTS, READY_IMAGES, REVIEWS, SHOP, SIZE_GUIDE } from './content.js';
import './site.css';

const FONTS = ['https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css'];
const won = (value) => `${value.toLocaleString('ko-KR')}원`;
const byId = (id) => PRODUCTS.find((item) => item.id === id);
const off = (product) => Math.round((1 - product.sale / product.price) * 100);

// 장바구니·찜은 이 시안 안에서만 유지됩니다. (새로고침하면 비워짐)
const ShopContext = createContext(null);
const useShop = () => useContext(ShopContext);

function Photo({ value, className = '', eager = false }) {
  return <SitePhoto siteId="hazel-closet" value={value} ready={READY_IMAGES} className={className} eager={eager} />;
}

function Header() {
  const scrolled = useScrolled(40);
  const { count } = useShop();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`hz-header${scrolled ? ' is-scrolled' : ''}`}>
      <p className="hz-topbar">신규 회원 첫 구매 10% 쿠폰 · {won(SHOP.freeShipping)} 이상 무료배송</p>
      <div className="hz-header__main">
        <button type="button" className="hz-iconbtn hz-burger" aria-label="메뉴 열기" onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
        <nav className="hz-nav" aria-label="상품 분류">
          {CATEGORIES.map(([value, label]) => <Link key={value} to={value === 'all' ? 'shop' : `shop/${value}`}>{label}</Link>)}
        </nav>
        <Link to="" className="hz-logo" aria-label={`${SHOP.name} 홈`}>{SHOP.english}</Link>
        <div className="hz-util">
          <Link to="shop" className="hz-iconbtn" aria-label="상품 검색"><Search aria-hidden="true" /></Link>
          <span className="hz-iconbtn hz-hide-m" title="로그인 (시안)" aria-hidden="true"><User /></span>
          <Link to="cart" className="hz-iconbtn hz-cartbtn" aria-label={`장바구니 ${count}개`}><ShoppingBag aria-hidden="true" />{count ? <span>{count}</span> : null}</Link>
        </div>
      </div>
      <MenuDrawer open={open} onClose={close} className="hz-drawer">
        <div className="hz-drawer__top"><span className="hz-logo">{SHOP.english}</span><button type="button" className="hz-iconbtn" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">
          <Link to="" onClick={close}>홈</Link>
          {CATEGORIES.map(([value, label]) => <Link key={value} to={value === 'all' ? 'shop' : `shop/${value}`} onClick={close}>{label}</Link>)}
          <Link to="cart" onClick={close}>장바구니 ({count})</Link>
        </nav>
      </MenuDrawer>
    </header>
  );
}

function Price({ product, size = '' }) {
  return (
    <p className={`hz-price ${size}`}>
      {product.sale < product.price ? <><em>{off(product)}%</em><b>{won(product.sale)}</b><s>{won(product.price)}</s></> : <b>{won(product.sale)}</b>}
    </p>
  );
}

function ProductCard({ product, rank }) {
  const { liked, toggleLike } = useShop();
  const isLiked = liked.includes(product.id);
  return (
    <li className="hz-card" data-reveal>
      <Link to={`product/${product.id}`} className="hz-card__media">
        <Photo value={product.photo} />
        {rank ? <span className="hz-rank">{rank}</span> : null}
        <span className="hz-card__quick">자세히 보기</span>
      </Link>
      <button type="button" className={`hz-like${isLiked ? ' is-on' : ''}`} aria-pressed={isLiked} aria-label={`${product.name} 찜하기`} onClick={() => toggleLike(product.id)}><Heart aria-hidden="true" /></button>
      <div className="hz-card__body">
        <ul className="hz-swatches" aria-label="색상">{product.colors.map(([name, hex]) => <li key={name} title={name} style={{ background: hex }} />)}</ul>
        <Link to={`product/${product.id}`} className="hz-card__name">{product.name}</Link>
        <Price product={product} />
        <p className="hz-card__meta">{product.badge.map((badge) => <span key={badge} className={`hz-badge is-${badge.toLowerCase()}`}>{badge}</span>)}<small>리뷰 {product.reviews}</small></p>
      </div>
    </li>
  );
}

function HomePage() {
  const [tab, setTab] = useState('all');
  const best = useMemo(() => [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).filter((item) => tab === 'all' || item.category === tab).slice(0, 4), [tab]);
  const news = PRODUCTS.filter((item) => item.badge.includes('NEW'));
  return (
    <>
      <section className="hz-hero">
        <Photo value={LOOKS.hero} className="hz-hero__img" eager />
        <div className="hz-hero__copy">
          <p className="hz-eyebrow">2026 WINTER COLLECTION</p>
          <h1>오래 입는 옷,<br />조용한 계절.</h1>
          <p>매일 손이 가는 기본을 더 좋은 원단으로 다시 만들었습니다.</p>
          <Link to="shop/outer" className="hz-btn">아우터 보러 가기</Link>
        </div>
      </section>

      <ul className="hz-benefits" aria-label="쇼핑 혜택">
        <li><b>무료배송</b><span>{won(SHOP.freeShipping)} 이상</span></li>
        <li><b>신규 10%</b><span>첫 구매 쿠폰</span></li>
        <li><b>무료 교환</b><span>사이즈 교환 1회</span></li>
        <li><b>오후 2시</b><span>이전 주문 당일 출고</span></li>
      </ul>

      <section className="hz-section">
        <div className="hz-head" data-reveal><h2>NEW ARRIVALS</h2><Link to="shop" className="hz-more">전체 보기 <ChevronRight size={16} aria-hidden="true" /></Link></div>
        <ul className="hz-grid">{news.map((product) => <ProductCard key={product.id} product={product} />)}</ul>
      </section>

      <section className="hz-split" aria-label="룩북">
        <Photo value={LOOKS.knit} className="hz-split__img" />
        <div className="hz-split__copy" data-reveal>
          <p className="hz-eyebrow">LOOKBOOK 01</p>
          <h2>니트 위에 니트,<br />부드럽게 겹치는 법.</h2>
          <p>오트밀 케이블 가디건에 크림 터틀넥을 받쳐 입었습니다. 같은 계열의 톤을 겹치면 따뜻하고 단정해 보입니다.</p>
          <ul className="hz-lookitems">
            {['cable-cardigan', 'rib-turtleneck', 'wide-slacks'].map((id) => { const item = byId(id); return <li key={id}><Link to={`product/${id}`}><Photo value={item.photo} /><span>{item.name}<b>{won(item.sale)}</b></span></Link></li>; })}
          </ul>
        </div>
      </section>

      <section className="hz-section">
        <div className="hz-head" data-reveal><h2>WEEKLY BEST</h2>
          <div className="hz-tabs" role="group" aria-label="베스트 분류">
            {CATEGORIES.map(([value, label]) => <button key={value} type="button" aria-pressed={tab === value} onClick={() => setTab(value)}>{label}</button>)}
          </div>
        </div>
        {best.length ? <ul className="hz-grid">{best.map((product, index) => <ProductCard key={product.id} product={product} rank={index + 1} />)}</ul> : <p className="hz-empty">이 분류의 베스트 상품을 준비 중입니다.</p>}
      </section>

      <section className="hz-banner">
        <Photo value={LOOKS.rack} className="hz-banner__img" />
        <div className="hz-banner__copy" data-reveal>
          <p className="hz-eyebrow">SHOWROOM</p>
          <h2>성수 쇼룸에서 직접 입어 보세요.</h2>
          <p>{SHOP.address} · 화–토 12:00 – 19:00</p>
        </div>
      </section>

      <section className="hz-section">
        <div className="hz-head" data-reveal><h2>REVIEW</h2><span className="hz-head__sub">구매하신 분들이 직접 남긴 후기</span></div>
        <ul className="hz-reviews">
          {REVIEWS.map((review) => { const item = byId(review.product); return (
            <li key={review.name + review.product} data-reveal>
              <Link to={`product/${item.id}`} className="hz-reviews__item"><Photo value={item.photo} /><span>{item.name}</span></Link>
              <p className="hz-stars" aria-label={`별점 ${review.rating}점`}>{'★'.repeat(review.rating)}<span>{'★'.repeat(5 - review.rating)}</span></p>
              <p>{review.text}</p>
              <small>{review.name} · {review.size}</small>
            </li>
          ); })}
        </ul>
      </section>
    </>
  );
}

const SORTS = Object.freeze([['new', '신상품순'], ['best', '인기순'], ['low', '낮은 가격순'], ['high', '높은 가격순']]);

function ShopPage({ category }) {
  const [sort, setSort] = useState('new');
  const label = CATEGORIES.find(([value]) => value === category)?.[1] || '전체';
  const list = useMemo(() => {
    const items = PRODUCTS.filter((item) => category === 'all' || item.category === category);
    const sorted = [...items];
    if (sort === 'best') sorted.sort((a, b) => b.reviews - a.reviews);
    if (sort === 'low') sorted.sort((a, b) => a.sale - b.sale);
    if (sort === 'high') sorted.sort((a, b) => b.sale - a.sale);
    return sorted;
  }, [category, sort]);
  return (
    <section className="hz-section hz-list">
      <nav className="hz-crumbs" aria-label="현재 위치"><Link to="">HOME</Link><ChevronRight size={12} aria-hidden="true" /><b>{label}</b></nav>
      <h1 className="hz-pagetitle">{label}</h1>
      <div className="hz-catbar">
        {CATEGORIES.map(([value, name]) => <Link key={value} to={value === 'all' ? 'shop' : `shop/${value}`} className={value === category ? 'is-on' : ''}>{name}</Link>)}
      </div>
      <div className="hz-toolbar">
        <p>총 <b>{list.length}</b>개의 상품</p>
        <label>정렬<select value={sort} onChange={(event) => setSort(event.target.value)}>{SORTS.map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label>
      </div>
      <ul className="hz-grid">{list.map((product) => <ProductCard key={product.id} product={product} />)}</ul>
    </section>
  );
}

function ProductPage({ product }) {
  const { add } = useShop();
  const [color, setColor] = useState('');
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '');
  const [lines, setLines] = useState([]);
  const [tab, setTab] = useState('detail');
  const [message, setMessage] = useState('');
  const pick = (nextColor, nextSize) => {
    if (!nextColor || !nextSize) return;
    const key = `${nextColor}/${nextSize}`;
    setLines((current) => (current.some((line) => line.key === key) ? current : [...current, { key, color: nextColor, size: nextSize, qty: 1 }]));
    setColor(''); if (product.sizes.length > 1) setSize('');
  };
  const setQty = (key, delta) => setLines((current) => current.map((line) => (line.key === key ? { ...line, qty: Math.max(1, line.qty + delta) } : line)));
  const total = lines.reduce((sum, line) => sum + line.qty * product.sale, 0);
  const submit = (buy) => {
    if (!lines.length) { setMessage('색상과 사이즈를 먼저 선택해 주세요.'); return; }
    lines.forEach((line) => add(product.id, line));
    setLines([]);
    setMessage(buy ? '시안이므로 결제는 진행되지 않습니다. 장바구니에 담아 두었어요.' : '장바구니에 담았습니다.');
  };
  const related = PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category).concat(PRODUCTS.filter((item) => item.category !== product.category)).slice(0, 4);
  return (
    <>
      <section className="hz-detail">
        <div className="hz-detail__media"><Photo value={product.photo} eager /></div>
        <div className="hz-detail__info">
          <nav className="hz-crumbs" aria-label="현재 위치"><Link to="">HOME</Link><ChevronRight size={12} aria-hidden="true" /><Link to={`shop/${product.category}`}>{CATEGORIES.find(([value]) => value === product.category)?.[1]}</Link></nav>
          <p className="hz-card__meta">{product.badge.map((badge) => <span key={badge} className={`hz-badge is-${badge.toLowerCase()}`}>{badge}</span>)}</p>
          <h1>{product.name}</h1>
          <p className="hz-rating"><Star size={14} aria-hidden="true" /> {product.rating} <small>리뷰 {product.reviews}개</small></p>
          <Price product={product} size="is-lg" />
          <dl className="hz-specs">
            <div><dt>배송</dt><dd><Truck size={14} aria-hidden="true" /> {won(SHOP.shippingFee)} ({won(SHOP.freeShipping)} 이상 무료) · 오후 2시 이전 당일 출고</dd></div>
            <div><dt>적립</dt><dd>{won(Math.round(product.sale * 0.01))} (1%)</dd></div>
          </dl>
          <div className="hz-option">
            <p className="hz-option__label">색상 {color ? <b>{color}</b> : null}</p>
            <div className="hz-colors">{product.colors.map(([name, hex]) => <button key={name} type="button" aria-pressed={color === name} aria-label={name} title={name} style={{ '--c': hex }} onClick={() => { setColor(name); pick(name, size); }} />)}</div>
            {product.sizes.length > 1 ? (
              <>
                <p className="hz-option__label">사이즈</p>
                <div className="hz-sizes">{product.sizes.map((value) => <button key={value} type="button" aria-pressed={size === value} onClick={() => { setSize(value); pick(color, value); }}>{value}</button>)}</div>
              </>
            ) : null}
          </div>
          {lines.length ? (
            <ul className="hz-lines">
              {lines.map((line) => (
                <li key={line.key}>
                  <span>{line.color} / {line.size}</span>
                  <div className="hz-qty"><button type="button" aria-label="수량 빼기" onClick={() => setQty(line.key, -1)}><Minus size={14} /></button><b>{line.qty}</b><button type="button" aria-label="수량 더하기" onClick={() => setQty(line.key, 1)}><Plus size={14} /></button></div>
                  <b>{won(line.qty * product.sale)}</b>
                  <button type="button" className="hz-x" aria-label="선택 삭제" onClick={() => setLines((current) => current.filter((item) => item.key !== line.key))}><X size={14} /></button>
                </li>
              ))}
            </ul>
          ) : <p className="hz-hint">옵션을 선택하면 아래에 담깁니다.</p>}
          <p className="hz-total">총 상품금액 <b>{won(total)}</b></p>
          <div className="hz-actions">
            <button type="button" className="hz-btn hz-btn--dark" onClick={() => submit(true)}>구매하기</button>
            <button type="button" className="hz-btn hz-btn--line" onClick={() => submit(false)}>장바구니</button>
          </div>
          {message ? <p className="hz-toast" role="status">{message} {message.includes('담') ? <Link to="cart">장바구니 보기 →</Link> : null}</p> : null}
        </div>
      </section>

      <section className="hz-section hz-detailtabs">
        <div className="hz-tabs hz-tabs--line" role="tablist" aria-label="상품 정보">
          {[['detail', '상세정보'], ['size', '사이즈'], ['review', `리뷰 (${product.reviews})`], ['ship', '배송·교환']].map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)}>{label}</button>)}
        </div>
        <div className="hz-tabpanel" role="tabpanel">
          {tab === 'detail' ? <div className="hz-desc"><p>{product.desc}</p><dl><div><dt>소재</dt><dd>{product.fabric}</dd></div><div><dt>핏</dt><dd>{product.fit}</dd></div><div><dt>세탁</dt><dd>드라이클리닝 권장 · 그늘에 뉘어 건조</dd></div></dl><Photo value={product.photo} className="hz-desc__img" /></div> : null}
          {tab === 'size' ? <table className="hz-sizetable"><thead><tr>{SIZE_GUIDE.head.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead><tbody>{SIZE_GUIDE.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => (index ? <td key={index}>{cell}</td> : <th key={index} scope="row">{cell}</th>))}</tr>)}</tbody><caption>단위 cm · 재는 방법에 따라 1~2cm 차이가 있을 수 있습니다.</caption></table> : null}
          {tab === 'review' ? <ul className="hz-reviewlist">{(REVIEWS.filter((review) => review.product === product.id).length ? REVIEWS.filter((review) => review.product === product.id) : REVIEWS.slice(0, 2)).map((review) => <li key={review.name}><p className="hz-stars">{'★'.repeat(review.rating)}<span>{'★'.repeat(5 - review.rating)}</span></p><p>{review.text}</p><small>{review.name} · {review.size}</small></li>)}</ul> : null}
          {tab === 'ship' ? <ul className="hz-shipinfo"><li>배송비 {won(SHOP.shippingFee)}, {won(SHOP.freeShipping)} 이상 무료배송</li><li>평일 오후 2시 이전 결제 시 당일 출고 (주말·공휴일 제외)</li><li>받은 날부터 7일 이내 교환·반품 가능, 사이즈 교환 1회 무료</li><li>착용·세탁·택 제거 시 교환·반품이 어렵습니다</li></ul> : null}
        </div>
      </section>

      <section className="hz-section">
        <div className="hz-head"><h2>함께 보면 좋은 상품</h2></div>
        <ul className="hz-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</ul>
      </section>
    </>
  );
}

function CartPage() {
  const { cart, setQty, remove, clear } = useShop();
  const [done, setDone] = useState(false);
  const subtotal = cart.reduce((sum, line) => sum + line.qty * byId(line.id).sale, 0);
  const shipping = subtotal === 0 || subtotal >= SHOP.freeShipping ? 0 : SHOP.shippingFee;
  if (done) {
    return <section className="hz-section hz-cart"><div className="hz-done"><h1>주문이 접수되었습니다.</h1><p>시안이므로 실제 결제·배송은 진행되지 않습니다.</p><Link to="shop" className="hz-btn hz-btn--dark">쇼핑 계속하기</Link></div></section>;
  }
  return (
    <section className="hz-section hz-cart">
      <h1 className="hz-pagetitle">장바구니</h1>
      {!cart.length ? (
        <div className="hz-done"><p>장바구니가 비어 있습니다.</p><Link to="shop" className="hz-btn hz-btn--dark">상품 보러 가기</Link></div>
      ) : (
        <div className="hz-cart__grid">
          <ul className="hz-cartlist">
            {cart.map((line) => { const item = byId(line.id); return (
              <li key={line.key}>
                <Link to={`product/${item.id}`} className="hz-cartlist__img"><Photo value={item.photo} /></Link>
                <div><Link to={`product/${item.id}`}><b>{item.name}</b></Link><small>{line.color} / {line.size}</small><span>{won(item.sale)}</span></div>
                <div className="hz-qty"><button type="button" aria-label="수량 빼기" onClick={() => setQty(line.key, -1)}><Minus size={14} /></button><b>{line.qty}</b><button type="button" aria-label="수량 더하기" onClick={() => setQty(line.key, 1)}><Plus size={14} /></button></div>
                <b className="hz-cartlist__sum">{won(line.qty * item.sale)}</b>
                <button type="button" className="hz-x" aria-label={`${item.name} 삭제`} onClick={() => remove(line.key)}><Trash2 size={16} /></button>
              </li>
            ); })}
          </ul>
          <aside className="hz-summary">
            <dl>
              <div><dt>상품금액</dt><dd>{won(subtotal)}</dd></div>
              <div><dt>배송비</dt><dd>{shipping ? won(shipping) : '무료'}</dd></div>
              <div className="is-total"><dt>결제 예정 금액</dt><dd>{won(subtotal + shipping)}</dd></div>
            </dl>
            {shipping ? <p className="hz-hint">{won(SHOP.freeShipping - subtotal)} 더 담으면 무료배송</p> : null}
            <button type="button" className="hz-btn hz-btn--dark" onClick={() => { clear(); setDone(true); }}>주문하기</button>
            <Link to="shop" className="hz-btn hz-btn--line">쇼핑 계속하기</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="hz-footer">
      <div className="hz-footer__top">
        <div><p className="hz-logo">{SHOP.english}</p><p>{SHOP.slogan}</p></div>
        <div><h2>CS CENTER</h2><p className="hz-footer__tel">{SHOP.phone}</p><p>{SHOP.cs}</p></div>
        <div><h2>BANK INFO</h2><p>{SHOP.bank}</p></div>
        <div><h2>NOTICE</h2><ul>{NOTICES.map(([date, title]) => <li key={title}><span>{title}</span><small>{date}</small></li>)}</ul></div>
      </div>
      <div className="hz-footer__legal">
        <p>상호 {SHOP.name} · 대표 {SHOP.owner} · 사업자등록번호 {SHOP.business} · 통신판매업신고 {SHOP.mailorder}</p>
        <p>주소 {SHOP.address} · 개인정보보호책임자 {SHOP.owner} · {SHOP.email}</p>
        <p>© 2026 HAZEL. 나나웹이 제작한 카페24 의류 쇼핑몰 스킨 시안이며, 상품·가격·업체 정보는 모두 샘플입니다.</p>
      </div>
    </footer>
  );
}

function NotFound() {
  return <section className="hz-section hz-cart"><div className="hz-done"><h1>페이지를 찾을 수 없습니다.</h1><Link to="" className="hz-btn hz-btn--dark">홈으로</Link></div></section>;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title, props = {}) => ({ Page, props, title: `${title} — ${SHOP.english}` });
  if (!section) return { Page: HomePage, props: {}, title: `${SHOP.english} ${SHOP.name} — ${SHOP.slogan}` };
  if (section === 'shop' && (!slug || CATEGORIES.some(([value]) => value === slug))) return make(ShopPage, CATEGORIES.find(([value]) => value === (slug || 'all'))[1], { category: slug || 'all' });
  if (section === 'product' && byId(slug)) return make(ProductPage, byId(slug).name, { product: byId(slug) });
  if (section === 'cart' && !slug) return make(CartPage, '장바구니');
  return make(NotFound, '페이지를 찾을 수 없습니다');
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, props, title } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState([]);
  const shop = useMemo(() => ({
    cart,
    liked,
    count: cart.reduce((sum, line) => sum + line.qty, 0),
    add: (id, line) => setCart((current) => {
      const key = `${id}/${line.key}`;
      const found = current.find((item) => item.key === key);
      return found ? current.map((item) => (item.key === key ? { ...item, qty: item.qty + line.qty } : item)) : [...current, { key, id, color: line.color, size: line.size, qty: line.qty }];
    }),
    setQty: (key, delta) => setCart((current) => current.map((item) => (item.key === key ? { ...item, qty: Math.max(1, item.qty + delta) } : item))),
    remove: (key) => setCart((current) => current.filter((item) => item.key !== key)),
    clear: () => setCart([]),
    toggleLike: (id) => setLiked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
  }), [cart, liked]);
  return (
    <ShopContext.Provider value={shop}>
      <div className="hz" ref={root}>
        <Header />
        <main id="site-main" tabIndex={-1}><Page key={page} {...props} /></main>
        <Footer />
      </div>
    </ShopContext.Provider>
  );
}
