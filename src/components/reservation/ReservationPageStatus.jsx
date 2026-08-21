function ReservationPageStatus({ isLoading, errorMessage }) {
  if (isLoading) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p role="status" className="text-sm font-semibold text-[#8B8575]">
          하우스 정보를 불러오는 중이에요...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p
          role="alert"
          className="rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#E63946]"
        >
          {errorMessage}
        </p>
      </div>
    );
  }

  return null;
}

export default ReservationPageStatus;
