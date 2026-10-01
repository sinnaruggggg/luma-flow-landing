import { useEffect } from 'react';

// 글자가 무작위 글자에서 제자리로 "해독"되듯 나타나는 효과.
// 한글 글자만 바꿔서 글자 폭이 흔들리지 않게 합니다. 반환값은 즉시 원래 글자로 되돌리는 함수입니다.
const HANGUL_POOL = '웹앱코드설계화면구조개발배포반응형데이터';
export function decodeText(el, duration = 1100) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push({ node: walker.currentNode, text: walker.currentNode.nodeValue });
  const total = nodes.reduce((sum, item) => sum + item.text.length, 0) || 1;
  const startAt = performance.now();
  let frameId = 0;
  const tick = (now) => {
    const t = (now - startAt) / duration;
    let offset = 0;
    for (const item of nodes) {
      let out = '';
      for (let i = 0; i < item.text.length; i += 1) {
        const ch = item.text[i];
        const settle = ((offset + i) / total) * 0.75;
        const isHangul = ch >= '가' && ch <= '힣';
        out += t >= settle + 0.25 || !isHangul ? ch : HANGUL_POOL[Math.floor(Math.random() * HANGUL_POOL.length)];
      }
      offset += item.text.length;
      item.node.nodeValue = out;
    }
    if (t < 1) frameId = requestAnimationFrame(tick);
  };
  frameId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frameId);
    nodes.forEach((item) => { item.node.nodeValue = item.text; });
  };
}

// 히어로 제목용: 처음 한 번 해독 효과를 실행합니다.
export function useDecodeTitle(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    return decodeText(el);
  }, [ref, enabled]);
}
