export default function WeeklyCompletionRate({
  completedCount,
  totalCount,
  isLoading,
  errorMessage,
}) {
  const rate =
    totalCount === 0
      ? 0
      : Math.round(
          (completedCount /
            totalCount) *
            100,
        );

  return (
    <section className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-black">
            이번 주 완료율
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#8B8575]">
            이번 주에 배정된 내 업무 중 완료한 비율이에요.
          </p>

          {!isLoading && !errorMessage && (
            <p className="mt-3 text-sm font-bold">
              {completedCount}/{totalCount} 완료
            </p>
          )}

          {isLoading && (
            <p
              role="status"
              className="mt-3 text-sm font-semibold text-[#8B8575]"
            >
              완료율을 계산하는 중이에요...
            </p>
          )}

          {!isLoading && errorMessage && (
            <p
              role="alert"
              className="mt-3 text-sm font-semibold text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <div
          className="grid h-36 w-36 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#91F43F ${rate}%, #EFEBE2 ${rate}% 100%)`,
          }}
          aria-label={`이번 주 완료율 ${rate}%`}
        >
          <div className="grid h-[108px] w-[108px] place-items-center rounded-full bg-white">
            <span className="text-2xl font-black">
              {isLoading || errorMessage
                ? "-"
                : `${rate}%`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
