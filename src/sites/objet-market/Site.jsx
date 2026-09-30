import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ArrowRight, Check, Heart, Menu, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { SitePhoto } from '../_kit/SitePhoto.jsx';
import { useFonts, useReveal, useScrolled } from '../_kit/hooks.js';
import { ALL_PHOTO_KEYS, BANNERS, CATEGORIES, PRODUCTS, READY_IMAGES, SHOP } from './content.js';
import './site.css';

const FONTS = ['https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css'];
const won = (value) => `${value.toLocaleString('ko-KR')}원`;
const byId = (id) => PRODUCTS.find((item) => item.id === id);

// 장바구니는 이 사이트 안에서만 유지되는 시안용 상태입니다. (새로고침하면 비워짐)
const CartContext = createContext(null);
const useCart = () => useContext(CartContext);

function Photo({ value, className = '', eager = false }) {
  return <SitePhoto siteId="objet-market" value={value} ready={READY_IMAGES} className={className} eager={eager} />;
}

function Header() {
  const scrolled = useScrolled();
  const { count, bump } = useCart();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`om-header${scrolled ? ' is-scrolled' : ''}`}>
      <p className="om-notice">{won(SHOP.freeShipping)} 이상 무료배송 · 모든 제품은 작가가 직접 검수합니다</p>
      <div className="om-wrap om-header__inner">
        <button type="button" className="om-burger" aria-label="메뉴 열기" onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
        <Link to="" className="om-logo">{SHOP.english}</Link>
        <nav className="om-nav" aria-label="상품 분류">
          {CATEGORIES.map(([value, label]) => <Link key={value} to={value === 'all' ? 'shop' : `shop/${value}`}>{label}</Link>)}
        </nav>
        <Link to="cart" className={`om-cartbtn${bump ? ' is-bump' : ''}`} aria-label={`장바구니 ${count}개`}>
          <ShoppingBag size={22} aria-hidden="true" />{count ? <span>{count}</span> : null}
        </Link>
      </div>
      <MenuDrawer open={open} onClose={close} className="om-drawer">
        <div className="om-drawer__top"><span className="om-logo">{SHOP.english}</span><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">
          <Link to="" onClick={close}>홈</Link>
          {CATEGORIES.map(([value, label]) => <Link key={value} to={value === 'all' ? 'shop' : `shop/${value}`} onClick={close}>{label}</Link>)}
          <Link to="cart" onClick={close}>장바구니 ({count})</Link>
        </nav>
      </MenuDrawer>
    </header>
  );
}

function ProductCard({ product }) {
  const { liked, toggleLike } = useCart();
  const isLiked = liked.includes(product.id);
  return (
    <article className="om-card">
      <Link to={`product/${product.id}`} className="om-card__media">
        <Photo value={product.photo} />
        {product.isNew ? <span className="om-tag">NEW</span> : null}
      </Link>
      <button type="button" className={`om-like${isLiked ? ' is-on' : ''}`} aria-pressed={isLiked} aria-label={`${product.name} 찜하기`} onClick={() => toggleLike(product.id)}><Heart size={18} aria-hidden="true" /></button>
      <Link to={`product/${product.id}`} className="om-card__body">
        <span className="om-card__maker">{product.maker}</span>
        <b>{product.name}</b>
        <span className="om-card__price">{won(product.price)}</span>
      </Link>
    </article>
  );
}

function HomePage() {
  const fresh = PRODUCTS.filter((item) => item.isNew);
  return (
    <>
      <section className="om-hero">
        <Photo value={BANNERS.table} className="om-hero__img" eager />
        <div className="om-wrap om-hero__text">
          <p className="om-kicker">가을 컬렉션</p>
          <h1>매일 손이 가는<br />그릇과 화병.</h1>
          <p>작가 네 명의 공방에서 한 점씩 만든 생활 도자기를 소개합니다.</p>
          <Link to="shop" className="om-btn">컬렉션 보기 <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      <section className="om-section">
        <div className="om-wrap">
          <ul className="om-cats">
            {CATEGORIES.slice(1).map(([value, label]) => {
              const first = PRODUCTS.find((item) => item.category === value);
              return (
                <li key={value} data-reveal><Link to={`shop/${value}`}><Photo value={first.photo} /><span>{label}<small>{PRODUCTS.filter((item) => item.category === value).length}</small></span></Link></li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="om-section">
        <div className="om-wrap">
          <div className="om-head" data-reveal><h2>새로 들어온 물건</h2><Link to="shop" className="om-more">전체 보기 <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="om-grid om-grid--4">{[...fresh, ...PRODUCTS.filter((item) => !item.isNew)].slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>
      <section className="om-story">
        <Photo value={BANNERS.shelf} className="om-story__img" />
        <div className="om-story__text" data-reveal>
          <p className="om-kicker">EDITOR'S NOTE</p>
          <h2>선반 하나를<br />정리하는 법.</h2>
          <p>높이가 다른 화병 두 점과 컵 하나. 세 가지만 두고 나머지는 비워 두세요. 물건이 적을수록 하나하나가 오래 보입니다.</p>
          <Link to="shop/vase" className="om-btn om-btn--line">화병 둘러보기</Link>
        </div>
      </section>
      <section className="om-section">
        <div className="om-wrap">
          <div className="om-head" data-reveal><h2>오래 사랑받는 물건</h2></div>
          <div className="om-grid om-grid--4">{PRODUCTS.filter((item) => !item.isNew).slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>
    </>
  );
}

function ShopPage({ category }) {
  const [sort, setSort] = useState('new');
  const list = useMemo(() => {
    const filtered = PRODUCTS.filter((item) => category === 'all' || item.category === category);
    if (sort === 'low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }, [category, sort]);
  const label = CATEGORIES.find(([value]) => value === category)?.[1];
  return (
    <section className="om-section om-section--top">
      <div className="om-wrap">
        <h1 className="om-title">{label}</h1>
        <div className="om-toolbar">
          <div className="om-chips" role="group" aria-label="분류">
            {CATEGORIES.map(([value, name]) => <Link key={value} to={value === 'all' ? 'shop' : `shop/${value}`} className={category === value ? 'is-on' : ''}>{name}</Link>)}
          </div>
          <label className="om-sort">정렬
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="new">신상품순</option><option value="low">낮은 가격순</option><option value="high">높은 가격순</option>
            </select>
          </label>
        </div>
        <p className="om-count" aria-live="polite">{list.length}개의 상품</p>
        <div className="om-grid om-grid--4">{list.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>
  );
}

function ProductPage({ product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('desc');
  const related = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return (
    <>
      <section className="om-section om-section--top">
        <div className="om-wrap om-product">
          <div className="om-product__media"><Photo value={product.photo} eager /></div>
          <div className="om-product__info">
            <nav className="om-crumbs" aria-label="현재 위치"><Link to="shop">전체</Link> / <Link to={`shop/${product.category}`}>{CATEGORIES.find(([value]) => value === product.category)[1]}</Link></nav>
            <p className="om-card__maker">{product.maker}</p>
            <h1>{product.name}</h1>
            <p className="om-product__price">{won(product.price)}</p>
            <p className="om-product__desc">{product.desc}</p>
            <fieldset className="om-options">
              <legend>색상</legend>
              {product.colors.map((name) => <button key={name} type="button" aria-pressed={color === name} onClick={() => setColor(name)}>{name}</button>)}
            </fieldset>
            <div className="om-qty">
              <span>수량</span>
              <div>
                <button type="button" aria-label="수량 줄이기" disabled={qty <= 1} onClick={() => setQty((value) => value - 1)}><Minus size={16} /></button>
                <output aria-live="polite">{qty}</output>
                <button type="button" aria-label="수량 늘리기" disabled={qty >= 9} onClick={() => setQty((value) => value + 1)}><Plus size={16} /></button>
              </div>
            </div>
            <p className="om-product__total"><span>총 상품 금액</span><b>{won(product.price * qty)}</b></p>
            <div className="om-product__actions">
              <button type="button" className="om-btn om-btn--full" onClick={() => { add(product.id, color, qty); setAdded(true); }}>장바구니 담기</button>
              {added ? <p className="om-added" role="status"><Check size={16} aria-hidden="true" /> 담았어요. <Link to="cart">장바구니 보기</Link></p> : null}
            </div>
            <div className="om-tabs" role="tablist" aria-label="상품 정보">
              {[['desc', '상품 설명'], ['ship', '배송·교환']].map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)}>{label}</button>)}
            </div>
            <div className="om-tabpanel" role="tabpanel">
              {tab === 'desc'
                ? <p>수작업 특성상 크기와 색이 조금씩 다를 수 있으며, 이는 불량이 아닌 수공예의 특징입니다. 식기세척기 사용이 가능하지만 손 세척을 권합니다.</p>
                : <p>주문 후 2~4일 안에 출고되며 {won(SHOP.freeShipping)} 이상 무료배송입니다(미만 {won(SHOP.shippingFee)}). 수령 후 7일 안에 교환·반품을 신청할 수 있습니다.</p>}
            </div>
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="om-section">
          <div className="om-wrap">
            <div className="om-head"><h2>같은 분류의 물건</h2></div>
            <div className="om-grid om-grid--4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const [stage, setStage] = useState('cart');
  const [form, setForm] = useState({ name: '', phone: '', address: '', agree: false });
  const [error, setError] = useState('');
  const subtotal = items.reduce((sum, item) => sum + byId(item.id).price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SHOP.freeShipping ? 0 : SHOP.shippingFee;
  const left = Math.max(0, SHOP.freeShipping - subtotal);

  if (stage === 'done') {
    return (
      <section className="om-section om-section--top">
        <div className="om-wrap om-done" role="status">
          <span><Check size={30} aria-hidden="true" /></span>
          <h1>주문이 접수된 것처럼 보이는 화면입니다.</h1>
          <p>이 사이트는 시안이므로 실제로 결제·배송되지 않습니다.</p>
          <Link to="shop" className="om-btn">계속 둘러보기</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="om-section om-section--top">
      <div className="om-wrap">
        <h1 className="om-title">{stage === 'cart' ? '장바구니' : '주문서'}</h1>
        {!items.length ? (
          <div className="om-empty"><p>장바구니가 비어 있어요.</p><Link to="shop" className="om-btn">상품 둘러보기</Link></div>
        ) : (
          <div className="om-cart">
            <div>
              {stage === 'cart' ? (
                <ul className="om-cart__list">
                  {items.map((item) => {
                    const product = byId(item.id);
                    return (
                      <li key={`${item.id}-${item.color}`}>
                        <Link to={`product/${product.id}`}><Photo value={product.photo} /></Link>
                        <div className="om-cart__info"><b>{product.name}</b><span>{item.color} · {won(product.price)}</span></div>
                        <div className="om-qty om-qty--sm">
                          <div>
                            <button type="button" aria-label="수량 줄이기" disabled={item.qty <= 1} onClick={() => setQty(item, item.qty - 1)}><Minus size={14} /></button>
                            <output>{item.qty}</output>
                            <button type="button" aria-label="수량 늘리기" disabled={item.qty >= 9} onClick={() => setQty(item, item.qty + 1)}><Plus size={14} /></button>
                          </div>
                        </div>
                        <b className="om-cart__line">{won(product.price * item.qty)}</b>
                        <button type="button" className="om-cart__remove" aria-label={`${product.name} 삭제`} onClick={() => remove(item)}><Trash2 size={18} /></button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="om-form">
                  <label>받는 분<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" /></label>
                  <label>휴대폰 번호<input value={form.phone} inputMode="tel" placeholder="010-0000-0000" onChange={(event) => setForm({ ...form, phone: event.target.value })} autoComplete="tel" /></label>
                  <label>배송 주소<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="시안이므로 실제 주소를 적지 않아도 됩니다" /></label>
                  <label className="om-agree"><input type="checkbox" checked={form.agree} onChange={(event) => setForm({ ...form, agree: event.target.checked })} />주문 내용과 개인정보 수집·이용에 동의합니다.</label>
                  <p className="om-fine">결제 수단 선택 단계는 시안에서 생략했습니다.</p>
                  {error ? <p className="om-error" role="alert">{error}</p> : null}
                </div>
              )}
            </div>
            <aside className="om-summary" aria-live="polite">
              <div className="om-freebar" aria-label={left ? `무료배송까지 ${won(left)}` : '무료배송 적용'}>
                <p>{left ? <>무료배송까지 <b>{won(left)}</b></> : <><Check size={14} aria-hidden="true" /> 무료배송이 적용됩니다</>}</p>
                <i><b style={{ width: `${Math.min(100, (subtotal / SHOP.freeShipping) * 100)}%` }} /></i>
              </div>
              <dl>
                <div><dt>상품 금액</dt><dd>{won(subtotal)}</dd></div>
                <div><dt>배송비</dt><dd>{shipping ? won(shipping) : '무료'}</dd></div>
              </dl>
              <p className="om-summary__total"><span>결제 예정 금액</span><b>{won(subtotal + shipping)}</b></p>
              {stage === 'cart' ? (
                <button type="button" className="om-btn om-btn--full" onClick={() => setStage('form')}>주문하기</button>
              ) : (
                <>
                  <button type="button" className="om-btn om-btn--full" onClick={() => {
                    if (!form.name.trim() || !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.trim()) || !form.agree) { setError('받는 분, 휴대폰 번호, 동의 여부를 확인해 주세요.'); return; }
                    clear(); setStage('done');
                  }}>{won(subtotal + shipping)} 결제하기</button>
                  <button type="button" className="om-btn om-btn--line om-btn--full" onClick={() => setStage('cart')}>장바구니로 돌아가기</button>
                </>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function NotFoundPage() {
  return <section className="om-section om-section--top"><div className="om-wrap om-empty"><p>찾을 수 없는 페이지입니다.</p><Link to="" className="om-btn">홈으로</Link></div></section>;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title, props = {}) => ({ Page, props, title: `${title} — ${SHOP.name}` });
  if (!section) return { Page: HomePage, props: {}, title: `${SHOP.name} — 매일 손이 가는 생활 도자기` };
  if (section === 'shop' && (!slug || CATEGORIES.some(([value]) => value === slug))) return make(ShopPage, '상품', { category: slug || 'all' });
  if (section === 'product' && byId(slug)) return make(ProductPage, byId(slug).name, { product: byId(slug) });
  if (section === 'cart' && !slug) return make(CartPage, '장바구니');
  return make(NotFoundPage, '페이지를 찾을 수 없습니다');
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, props, title } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  const [items, setItems] = useState([]);
  const [liked, setLiked] = useState([]);
  const [bump, setBump] = useState(0);
  const cart = useMemo(() => ({
    items,
    liked,
    bump,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    add: (id, color, qty) => {
      setItems((current) => {
        const found = current.find((item) => item.id === id && item.color === color);
        return found ? current.map((item) => (item === found ? { ...item, qty: Math.min(9, item.qty + qty) } : item)) : [...current, { id, color, qty }];
      });
      setBump((value) => value + 1);
      window.setTimeout(() => setBump(0), 600);
    },
    setQty: (target, qty) => setItems((current) => current.map((item) => (item === target ? { ...item, qty } : item))),
    remove: (target) => setItems((current) => current.filter((item) => item !== target)),
    clear: () => setItems([]),
    toggleLike: (id) => setLiked((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id])),
  }), [items, liked, bump]);
  return (
    <CartContext.Provider value={cart}>
      <div className="om" ref={root}>
        <Header />
        <main id="site-main" tabIndex={-1}><Page key={page} {...props} /></main>
        <footer className="om-footer">
          <div className="om-wrap om-footer__inner">
            <p className="om-logo">{SHOP.english}</p>
            <p>고객센터 {SHOP.phone} · {SHOP.cs}</p>
            <p>{SHOP.address} · 사업자등록번호 000-00-00000 · 통신판매업 신고 제0000-서울마포-0000호</p>
            <p>© 2026 {SHOP.name}. 나나웹이 제작한 가상 쇼핑몰 시안이며 실제 판매하지 않습니다.</p>
            <PhotoCredits keys={ALL_PHOTO_KEYS} extra="" />
          </div>
        </footer>
      </div>
    </CartContext.Provider>
  );
}
