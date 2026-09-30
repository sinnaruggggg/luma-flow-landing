import { resolvePhoto } from './media.js';

// 사이트 사진 한 장. 이미지가 아직 없으면(src가 null) 은은한 자리표시 상자를 그립니다.
export function SitePhoto({ siteId, value, ready, className = '', eager = false, ...rest }) {
  const { src, alt } = resolvePhoto(siteId, value, ready);
  if (!src) return <div className={`nw-ph ${className}`} role="img" aria-label={alt} {...rest} />;
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" {...rest} />;
}

export default SitePhoto;
