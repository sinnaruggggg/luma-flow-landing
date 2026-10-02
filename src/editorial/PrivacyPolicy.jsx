import { PRIVACY_EFFECTIVE_DATE, PRIVACY_SECTIONS } from './data/privacyPolicy.js';
import './privacy.css';

// 개인정보 처리방침 페이지 (/privacy). 내용은 data/privacyPolicy.js 에서 고칩니다.
export function PrivacyPolicy() {
  return (
    <article className="privacy" aria-labelledby="privacy-title">
      <p className="privacy__kicker">PRIVACY POLICY</p>
      <h1 id="privacy-title">개인정보 처리방침</h1>
      <p className="privacy__date">시행일 {PRIVACY_EFFECTIVE_DATE}</p>
      {PRIVACY_SECTIONS.map(([title, blocks]) => (
        <section key={title}>
          <h2>{title}</h2>
          {blocks.map((block, index) => (Array.isArray(block)
            ? <ul key={index}>{block.map((item) => <li key={item}>{item}</li>)}</ul>
            : <p key={index}>{block}</p>))}
        </section>
      ))}
    </article>
  );
}

export default PrivacyPolicy;
