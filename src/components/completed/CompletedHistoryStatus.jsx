export default function CompletedHistoryStatus({
  isLoading,
  errorMessage,
}) {
  if (isLoading) {
    return (
      <div className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white px-5 py-14 text-center">
        <p
          role="status"
          className="text-sm font-semibold text-[#8B8575]"
        >
          완료 업무 기록을 불러오는 중이에요...
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

  return null;
}
