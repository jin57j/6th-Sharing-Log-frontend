import { RotateCcw } from "lucide-react";

import ChoreCategoryList from "./ChoreCategoryList";

function RotationOverviewContent({
  chores,
  occurrences,
  isLoading,
  errorMessage,
  onOpenCalendar,
}) {
  if (isLoading) {
    return (
      <div className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white px-5 py-12 text-center">
        <p role="status" className="text-sm font-semibold text-[#8B8575]">
          업무 로테이션을 불러오는 중이에요...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-2xl border border-[#E63946]/20 bg-[#E63946]/5 px-5 py-5"
      >
        <p className="text-sm font-semibold leading-6 text-[#E63946]">
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {chores.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-[#1A1428]/15 bg-white px-5 py-12 text-center">
          <RotateCcw
            size={34}
            className="mx-auto text-[#8B8575]"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-bold">아직 등록된 업무가 없어요.</p>
          <p className="mt-1 text-xs text-[#8B8575]">
            업무 관리 화면에서 반복 업무를 추가해 주세요.
          </p>
        </div>
      )}

      <ChoreCategoryList
        chores={chores}
        occurrences={occurrences}
        onOpenCalendar={onOpenCalendar}
      />
    </>
  );
}

export default RotationOverviewContent;
