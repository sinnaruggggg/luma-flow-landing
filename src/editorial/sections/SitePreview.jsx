import { QuoteIcon } from './QuoteIcon.jsx';
import './site-preview.css';

// 견적 계산기 오른쪽 "내 사이트 미리보기". 고른 기능이 화면 블록으로 조립되어 나타납니다. (장식용 예시 그림)
const MENU_COUNT = { landing: 0, intro: 4, brand: 6, platform: 5 };
const BLOCK_ORDER = ['booking', 'shop', 'payment', 'subscription', 'gallery', 'review', 'admin', 'recruit', 'coupon', 'instagram', 'newsletter'];
const MAX_BLOCKS = 6;

function Block({ id }) {
  switch (id) {
    case 'booking':
      return <div className="spv-b spv-b--booking"><b>예약하기</b><div className="spv-cal">{Array.from({ length: 14 }, (_, i) => <i key={i} className={i === 9 ? 'is-on' : ''} />)}</div><span className="spv-btn">10:30 예약</span></div>;
    case 'shop':
      return <div className="spv-b spv-b--shop"><b>상품</b><div className="spv-goods">{[0, 1, 2].map((i) => <i key={i}><em /><small /></i>)}</div></div>;
    case 'payment':
      return <div className="spv-b spv-b--pay"><QuoteIcon name="card" size={18} /><span className="spv-btn">결제하기</span></div>;
    case 'subscription':
      return <div className="spv-b spv-b--sub"><QuoteIcon name="repeat" size={16} /><b>매달 자동결제</b></div>;
    case 'gallery':
      return <div className="spv-b spv-b--gallery">{[0, 1, 2].map((i) => <i key={i} />)}</div>;
    case 'review':
      return <div className="spv-b spv-b--review"><span>★★★★★</span><i /><i /></div>;
    case 'admin':
      return <div className="spv-b spv-b--board"><b>소식</b><p><i /><em>NEW</em></p><p><i /></p></div>;
    case 'recruit':
      return <div className="spv-b spv-b--recruit"><QuoteIcon name="person" size={16} /><b>채용 중</b><span className="spv-btn spv-btn--line">지원</span></div>;
    case 'coupon':
      return <div className="spv-b spv-b--coupon"><b>10%</b><span>쿠폰</span></div>;
    case 'instagram':
      return <div className="spv-b spv-b--insta">{[0, 1, 2, 3].map((i) => <i key={i} />)}</div>;
    case 'newsletter':
      return <div className="spv-b spv-b--news"><i /><span className="spv-btn">구독</span></div>;
    default:
      return null;
  }
}

export function SitePreview({ baseId, picked }) {
  const has = (id) => picked.includes(id);
  const blocks = BLOCK_ORDER.filter(has);
  const shown = blocks.slice(0, MAX_BLOCKS);
  const phone = has('app') || has('alert');
  return (
    <div className={`spv spv--${baseId}${has('motion') ? ' has-motion' : ''}`} aria-hidden="true">
      {has('admin') ? <div className="spv-admin"><span>관리자</span><i /><i /><i /></div> : null}
      <div className="spv-browser">
        <div className="spv-bar"><i /><i /><i /><span>my-brand.kr</span>{has('analytics') ? <b className="spv-stat"><QuoteIcon name="chart" size={12} /> 방문 +</b> : null}</div>
        <div className="spv-page">
          <div className="spv-nav">
            <span className={`spv-logo${has('logo') ? ' is-brand' : ''}`} />
            <span className="spv-menu">{Array.from({ length: MENU_COUNT[baseId] ?? 4 }, (_, i) => <i key={i} />)}</span>
            {has('i18n') ? <span className="spv-chip">KO|EN</span> : null}
            {has('member') || has('social') ? <span className="spv-chip spv-chip--dark">로그인</span> : null}
            {has('shop') ? <span className="spv-cart"><QuoteIcon name="cart" size={13} /></span> : null}
          </div>
          <div className={`spv-hero${has('content') ? ' is-filled' : ''}`}>
            <div><i /><i /><span className="spv-btn">문의하기</span></div>
            <em>{has('motion') ? <QuoteIcon name="spark" size={20} /> : null}</em>
          </div>
          <div className="spv-blocks">
            {shown.map((id) => <Block key={id} id={id} />)}
            {blocks.length > shown.length ? <div className="spv-b spv-b--more">+{blocks.length - shown.length}개 기능</div> : null}
            {!blocks.length ? <div className="spv-b spv-b--empty">기능을 고르면<br />여기에 나타나요</div> : null}
          </div>
          {has('popup') ? <div className="spv-popup"><b>휴무 안내</b><i /><span>닫기</span></div> : null}
          {has('chat') || has('chatbot') ? <div className="spv-chat">{has('chatbot') ? <QuoteIcon name="bot" size={16} /> : <QuoteIcon name="chat" size={16} />}</div> : null}
          {has('migrate') ? <span className="spv-tag">기존 글·사진 이전 ✓</span> : null}
        </div>
      </div>
      {phone ? (
        <div className="spv-phone">
          <div className="spv-noti"><b>{has('app') ? '나의 앱' : '문의 알림'}</b><span>{has('booking') ? '새 예약이 들어왔어요' : has('shop') ? '새 주문이 들어왔어요' : '새 문의가 왔어요'}</span></div>
          <i className="spv-phone__screen" />
        </div>
      ) : null}
    </div>
  );
}

export default SitePreview;
