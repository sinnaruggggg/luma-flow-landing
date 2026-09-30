import { withBasePath } from "../../lib/appPaths.js";
import { PROJECTS } from "../data/projects.js";

// 조건 검색의 "선호 스타일" 아래에 붙는 미리보기.
// 옵션을 가리지 않도록 스타일 영역 안의 정해진 자리에 표시하고, 그 스타일로 만든 실제 시안 화면을 보여 줍니다.
const STYLE_TEXT = {
  editorial: "잡지처럼 큰 제목과 사진, 여백의 리듬으로 이야기를 읽히게 합니다.",
  minimal: "색과 장식을 덜어 내고, 정보의 순서와 간격을 차분하게 정리합니다.",
  trust: "근거와 절차를 안정적인 구조에 담아 신뢰를 먼저 전합니다.",
  impact: "굵은 글자와 강한 대비, 움직임으로 첫 화면에서 각인시킵니다.",
  photography: "큰 사진과 어두운 톤으로 공간과 분위기를 감각적으로 전합니다.",
  undecided: "업종과 목표를 먼저 듣고, 서로 다른 방향을 비교해 제안해 드립니다.",
};

const LABELS = {
  editorial: "에디토리얼",
  minimal: "미니멀·차분함",
  trust: "신뢰·기업형",
  impact: "임팩트",
  photography: "사진·감성",
  undecided: "아직 모르겠음",
};

function samplesFor(value) {
  if (value === "undecided") {
    // 방향이 정해지지 않았다면 서로 다른 스타일의 시안을 골고루 보여 줍니다.
    const seen = new Set();
    return PROJECTS.filter((project) => !seen.has(project.style) && seen.add(project.style)).slice(0, 3);
  }
  return PROJECTS.filter((project) => project.style === value).slice(0, 3);
}

export function StylePreview({ value }) {
  const samples = value ? samplesFor(value) : [];
  return (
    <div className="style-preview" aria-live="polite">
      {!value ? (
        <p className="style-preview__hint">스타일에 마우스를 올리거나 선택하면, 그 스타일로 만든 실제 시안을 여기에서 보여 드려요.</p>
      ) : (
        <>
          <p className="style-preview__text"><b>{LABELS[value]}</b> {STYLE_TEXT[value]}</p>
          {samples.length ? (
            <ul className="style-preview__samples">
              {samples.map((project) => (
                <li key={project.id}>
                  <img src={project.thumbnail} alt={`${project.title} 첫 화면`} loading="lazy" decoding="async" />
                  <span className="style-preview__name">{project.title}</span>
                  <a href={withBasePath(project.siteUrl)} target="_blank" rel="noreferrer" aria-label={`${project.title} 시안 새 창에서 보기`}>보기 ↗</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="style-preview__hint">이 스타일의 시안은 준비 중입니다. 상담에서 참고 사례를 함께 보여 드려요.</p>
          )}
        </>
      )}
    </div>
  );
}

export default StylePreview;
