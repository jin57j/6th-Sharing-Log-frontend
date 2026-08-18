import {
  BellRing,
  Clock3,
} from "lucide-react";

import useNotificationSettings from "../../hooks/useNotificationSettings";

function NotificationSettingsSection({
  groupId,
}) {
  const {
    form,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    hourLimits,
    handleToggle,
    handleHoursChange,
    handleSubmit,
  } = useNotificationSettings(
    groupId,
  );

  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <BellRing
          size={21}
          aria-hidden="true"
        />

        <h2 className="text-lg font-black">
          알림 설정
        </h2>
      </div>

      <p className="mt-1 text-sm leading-6 text-[#8B8575]">
        현재 하우스에서 마감 임박
        업무를 언제 확인할지 설정해요.
      </p>

      {isLoading ? (
        <p
          role="status"
          className="mt-6 rounded-xl bg-[#F8F4EE] px-4 py-5 text-center text-sm font-semibold text-[#8B8575]"
        >
          알림 설정을 불러오는
          중이에요...
        </p>
      ) : (
        <form
          className="mt-6"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between gap-4 rounded-xl bg-[#F8F4EE] px-4 py-4">
            <div className="min-w-0">
              <p className="font-bold">
                마감 임박 알림
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8B8575]">
                담당 업무의 마감이
                가까워졌을 때 알려줘요.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                form.dueSoonEnabled
              }
              aria-label="마감 임박 알림 사용 여부"
              disabled={isSaving}
              onClick={handleToggle}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                form.dueSoonEnabled
                  ? "bg-[#E63946]"
                  : "bg-[#C9C5BD]"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  form.dueSoonEnabled
                    ? "left-6"
                    : "left-1"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Clock3
                size={18}
                aria-hidden="true"
              />

              <h3 className="font-black">
                기본 알림 시간
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#8B8575]">
              반복 주기별로 마감 몇
              시간 전부터 임박 업무로
              확인할지 설정해요.
            </p>

            <div className="mt-4 space-y-3">
              {hourLimits.map(
                (limit) => (
                  <label
                    key={limit.name}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#1A1428]/10 px-4 py-3"
                  >
                    <span className="text-sm font-bold">
                      {limit.label} 업무
                    </span>

                    <span className="flex items-center gap-2">
                      <input
                        type="number"
                        name={limit.name}
                        value={
                          form[limit.name]
                        }
                        min={limit.min}
                        max={limit.max}
                        step="1"
                        disabled={isSaving}
                        onChange={
                          handleHoursChange
                        }
                        className="w-20 rounded-lg border border-[#1A1428]/15 bg-white px-3 py-2 text-right text-sm font-bold outline-none transition focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/15 disabled:cursor-not-allowed disabled:bg-[#F8F4EE]"
                      />

                      <span className="w-12 text-xs font-semibold text-[#8B8575]">
                        시간 전
                      </span>
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-[#FFB703]/10 px-4 py-3 text-xs leading-5 text-[#8B6A00]">
            아직 실제 푸시 시간과 연동 안됨
          </p>

          {errorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-[#06D6A0]/25 bg-[#06D6A0]/10 px-4 py-3 text-sm font-semibold leading-6 text-[#087F67]"
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={
              isSaving ||
              !groupId
            }
            className="mt-5 w-full rounded-xl bg-[#E63946] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSaving
              ? "저장하는 중..."
              : "알림 설정 저장"}
          </button>
        </form>
      )}
    </section>
  );
}

export default NotificationSettingsSection;
