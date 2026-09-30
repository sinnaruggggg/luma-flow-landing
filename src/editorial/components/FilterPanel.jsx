import { useEffect, useId, useRef, useState } from "react";
import { OPTIONS } from "../data/projects.js";
import { FilterChips } from "./FilterChips.jsx";
import { StylePreview } from "./StylePreview.jsx";

const GROUPS = [
  { key: "budget", label: "예상 예산", step: "01" },
  { key: "industry", label: "업종", step: "02" },
  { key: "style", label: "선호 스타일", step: "03" },
];

function normalizeSelection(selection = {}) {
  return GROUPS.reduce((normalized, { key }) => {
    const candidate = selection[key];
    normalized[key] = OPTIONS[key]?.some((option) => option.value === candidate)
      ? candidate
      : "";
    return normalized;
  }, {});
}

export function FilterPanel({ selection = {}, onSubmit, onClose, trigger }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const [draft, setDraft] = useState(() => normalizeSelection(selection));
  // 마우스를 올린(또는 초점이 간) 스타일. 없으면 선택한 스타일의 시안을 보여 줍니다.
  const [hoverStyle, setHoverStyle] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [trigger]);

  const clearGroup = (group) => {
    setDraft((current) => ({ ...current, [group]: "" }));
  };

  const resetAll = () => setDraft(normalizeSelection());
  const isComplete = GROUPS.every(({ key }) => Boolean(draft[key]));
  const hasSelection = Object.values(draft).some(Boolean);

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isComplete) return;
    onSubmit({ ...draft });
    requestClose();
  };

  const handleDialogClick = (event) => {
    if (event.target !== event.currentTarget) return;
    const panel = event.currentTarget.querySelector(".finder-panel");
    const bounds = panel.getBoundingClientRect();
    const clickedOutside = event.clientX < bounds.left
      || event.clientX > bounds.right
      || event.clientY < bounds.top
      || event.clientY > bounds.bottom;
    if (clickedOutside) requestClose();
  };

  const trapFocus = (event) => {
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    const candidates = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')];
    const stops = candidates.filter((element) => {
      if (!element.getClientRects().length) return false;
      if (element.type !== 'radio') return true;
      const peers = candidates.filter(candidate => candidate.type === 'radio' && candidate.name === element.name);
      return element === (peers.find(peer => peer.checked) || peers[0]);
    });
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault(); first?.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="finder-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={handleDialogClick}
      onKeyDown={trapFocus}
    >
      <div className="finder-panel">
        <header className="finder-panel__header">
          <p className="finder-panel__eyebrow">프로젝트 찾기 · 세 단계</p>
          <h2 className="finder-panel__title" id={titleId}>내 프로젝트 찾기</h2>
          <p className="finder-panel__description" id={descriptionId}>
            세 가지 조건을 선택하면 현재 상황에 가까운 제작 사례를 모아 보여드립니다.
          </p>
          <button
            type="button"
            className="finder-panel__close"
            aria-label="프로젝트 찾기 닫기"
            onClick={requestClose}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </header>

        <div className="finder-panel__summary">
          <p className="finder-panel__summary-label">선택한 조건</p>
          <FilterChips selection={draft} onClear={clearGroup} />
          <button
            type="button"
            className="finder-panel__reset"
            disabled={!hasSelection}
            onClick={resetAll}
          >
            전체 초기화
          </button>
        </div>

        <form
          className="finder-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {GROUPS.map(({ key, label, step }) => (
            <fieldset className="finder-fieldset" key={key}>
              <legend className="finder-fieldset__legend">
                <span className="finder-fieldset__step">{step}</span>
                <span className="finder-fieldset__title">{label}</span>
              </legend>
              <div
                className="finder-fieldset__content"
                onMouseLeave={key === "style" ? () => setHoverStyle("") : undefined}
                onBlur={key === "style" ? (event) => {
                  // 옵션에서 미리보기 링크로 이동할 때는 유지하고, 스타일 영역을 완전히 벗어날 때만 초기화합니다.
                  if (!event.currentTarget.contains(event.relatedTarget)) setHoverStyle("");
                } : undefined}
              >
                <button
                  type="button"
                  className="finder-fieldset__clear"
                  disabled={!draft[key]}
                  onClick={() => clearGroup(key)}
                  aria-label={`${label} 선택 해제`}
                >
                  선택 해제
                </button>
                <div className="finder-fieldset__controls">
                  {OPTIONS[key].map((option) => (
                    <label
                      className="finder-option"
                      key={option.value}
                      onMouseEnter={key === "style" ? () => setHoverStyle(option.value) : undefined}
                      onFocus={key === "style" ? () => setHoverStyle(option.value) : undefined}
                    >
                      <input
                        type="radio"
                        className="finder-option__input"
                        name={`finder-${key}`}
                        value={option.value}
                        checked={draft[key] === option.value}
                        onChange={() => setDraft((current) => ({
                          ...current,
                          [key]: option.value,
                        }))}
                      />
                      <span className="finder-option__label">{option.label}</span>
                    </label>
                  ))}
                </div>
                {key === "style" ? <StylePreview value={hoverStyle || draft.style} /> : null}
              </div>
            </fieldset>
          ))}

          <button
            type="submit"
            className="finder-form__submit"
            disabled={!isComplete}
          >
            맞는 제작 사례 보기
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default FilterPanel;
