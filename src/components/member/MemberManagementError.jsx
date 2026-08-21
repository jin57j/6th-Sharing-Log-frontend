function MemberManagementError({ errorMessage }) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mt-5 rounded-2xl border border-[#E63946]/20 bg-[#E63946]/5 px-5 py-4"
    >
      <p className="text-sm font-semibold leading-6 text-[#E63946]">
        {errorMessage}
      </p>
    </div>
  );
}

export default MemberManagementError;
