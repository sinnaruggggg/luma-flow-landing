import { OPTIONS } from "../data/projects.js";

const GROUP_LABELS = {
  budget: "예산",
  industry: "업종",
  style: "선호 스타일",
};

function getOptionLabel(group, value) {
  return OPTIONS[group]?.find((option) => option.value === value)?.label ?? value;
}

export function FilterChips({ selection, onClear }) {
  return (
    <div
      className="finder-summary"
      aria-label="현재 선택한 검색 조건"
      aria-live="polite"
    >
      <div className="finder-summary__list">
        {Object.entries(GROUP_LABELS).map(([group, groupLabel]) => {
          const value = selection[group];

          if (!value) {
            return (
              <span className="finder-summary__empty" key={group}>
                {groupLabel} 미선택
              </span>
            );
          }

          const optionLabel = getOptionLabel(group, value);
          return (
            <button
              type="button"
              className="finder-summary__chip"
              key={group}
              onClick={() => onClear(group)}
              aria-label={`${groupLabel} 조건 ${optionLabel} 선택 해제`}
            >
              <span>{groupLabel} / {optionLabel}</span>
              <span className="finder-summary__remove" aria-hidden="true">×</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterChips;
