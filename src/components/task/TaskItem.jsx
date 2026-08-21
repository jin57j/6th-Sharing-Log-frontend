import fixIcon from "../../assets/icon/fix_icon.svg";
import searchIcon from "../../assets/icon/search_icon.svg";
import trashcanIcon from "../../assets/icon/trashcan_icon.svg";
import {
  formatChoreDueTime,
  getChoreFrequencyLabel,
  getChoreIcon,
  getChoreMemberCountText,
} from "../../utils/choreUtils";

import TaskRotationPreview from "./TaskRotationPreview";

function TaskItem({
  chore,
  groupMembers,
  isExpanded,
  rotationDisplayNames,
  onToggleRotation,
  onEdit,
  onDelete,
}) {
  const memberCountText =
    getChoreMemberCountText(
      chore.eligibility,
      groupMembers,
    );

  const dueTimeText =
    formatChoreDueTime(
      chore.schedule?.dueTime,
    );

  const frequencyLabel =
    getChoreFrequencyLabel(
      chore.schedule?.frequency,
    );

  return (
    <li className="flex flex-col border-b border-gray-100 px-4 py-4 transition-colors last:border-0 hover:bg-gray-50 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="shrink-0 text-3xl leading-none sm:text-[34px]"
          >
            {getChoreIcon(chore.name)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                {chore.name}
              </h3>

              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600 sm:px-3 sm:py-1 sm:text-xs">
                {frequencyLabel}
              </span>
            </div>

            <p className="mt-0.5 truncate text-[11px] text-gray-400 sm:text-xs">
              마감: {dueTimeText} · 로테이션{" "}
              {memberCountText}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            onClick={() =>
              onToggleRotation(chore)
            }
            className={`rounded-lg p-1.5 transition-colors sm:p-2 ${
              isExpanded
                ? "bg-blue-50 text-blue-500"
                : "text-gray-400 hover:bg-gray-100 hover:text-blue-500"
            }`}
            aria-label="로테이션 확인"
          >
            <img
              src={searchIcon}
              alt=""
              className="h-5 w-5"
            />
          </button>

          <button
            onClick={() => onEdit(chore)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:p-2"
            aria-label="수정"
          >
            <img
              src={fixIcon}
              alt=""
              className="h-5 w-5"
            />
          </button>

          <button
            onClick={() =>
              onDelete(
                chore.choreId,
                chore.version,
              )
            }
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 sm:p-2"
            aria-label="삭제"
          >
            <img
              src={trashcanIcon}
              alt=""
              className="h-5 w-5"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <TaskRotationPreview
          displayNames={
            rotationDisplayNames
          }
        />
      )}
    </li>
  );
}

export default TaskItem;
