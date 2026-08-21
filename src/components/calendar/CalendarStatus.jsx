function CalendarStatus({
  isLoading,
  errorMessage,
}) {
  if (isLoading) {
    return (
      <div className="border-t border-[#1A1428]/10 px-5 py-14 text-center">
        <p
          role="status"
          className="text-sm font-semibold text-[#8B8575]"
        >
          5주 동안의 일정을
          불러오는 중이에요...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="border-t border-[#E63946]/15 bg-[#E63946]/5 px-5 py-8 text-center"
      >
        <p className="text-sm font-semibold leading-6 text-[#E63946]">
          {errorMessage}
        </p>
      </div>
    );
  }

  return null;
}

export default CalendarStatus;
