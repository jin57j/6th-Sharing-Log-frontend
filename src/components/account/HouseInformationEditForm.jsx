function HouseInformationEditForm({
  icon: Icon,
  inputId,
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  helpText,
  isValid,
  showValidationError,
  validationMessage,
  hasChanged,
  isSaving,
  errorMessage,
  onCancel,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-b border-[#1A1428]/10 py-4"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-lg bg-[#E63946]/10 p-2 text-[#E63946]">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#8B8575]"
          >
            {label}
          </label>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            disabled={isSaving}
            autoFocus
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl border border-[#E63946]/30 bg-[#F8F4EE]/60 px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#8B8575]/60 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-[#8B8575]">{helpText}</p>
            <span className="shrink-0 text-xs font-semibold text-[#8B8575]">
              {value.length}/{maxLength}
            </span>
          </div>

          {showValidationError && (
            <p className="mt-2 text-xs font-semibold text-[#E63946]">
              {validationMessage}
            </p>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-[#E63946]/5 px-3 py-2 text-xs font-semibold text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-xl border border-[#1A1428]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#8B8575] transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid || !hasChanged || isSaving}
              className="flex items-center justify-center rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default HouseInformationEditForm;
