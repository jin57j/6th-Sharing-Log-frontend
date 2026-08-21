function TaskRotationPreview({
  displayNames,
}) {
  return (
    <div className="mt-3 rounded-xl bg-[#FDF8E7] p-3 text-xs text-gray-700 animate-fade-in sm:p-4 sm:text-sm">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <span className="shrink-0 font-bold text-gray-900">
          로테이션 순서:
        </span>

        <span className="break-all font-medium text-blue-600">
          {displayNames
            ? displayNames.join(" → ")
            : "불러오는 중..."}
        </span>
      </div>
    </div>
  );
}

export default TaskRotationPreview;
