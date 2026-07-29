import { RESERVATION_TIME_SLOTS } from "../../constants/reservation";

function ReservationList({
  selectedDate,
  selectedSpaceName,
  loading,
  reservations,
  onCancel,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white">
      <header className="flex items-center justify-between border-b border-[#1A1428]/10 px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-black text-[#1A1428]">
            {selectedSpaceName}
          </h2>

          <p className="mt-0.5 text-xs text-[#8B8575]">
            {selectedDate}
          </p>
        </div>

        <span className="rounded-full bg-[#06D6A0]/15 px-3 py-1 text-[11px] font-bold text-[#087F67]">
          30분 단위 예약
        </span>
      </header>

      {loading ? (
        <div className="grid min-h-48 place-items-center">
          <div className="text-center">
            <span
              className="mx-auto block h-6 w-6 animate-spin rounded-full border-2 border-[#E63946]/25 border-t-[#E63946]"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-[#8B8575]">
              예약을 불러오는 중입니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-px bg-[#1A1428]/10">
          {RESERVATION_TIME_SLOTS.map((slot) => {
            const reservation = reservations.find(
              (item) =>
                item.startTime <= slot &&
                item.endTime > slot,
            );

            const isMine = reservation?.mine === true;
            const memberInitial =
              reservation?.memberName?.slice(0, 1) ?? "";

            return (
              <button
                key={slot}
                type="button"
                disabled={!isMine}
                onClick={() => {
                  if (isMine) {
                    onCancel(reservation);
                  }
                }}
                className={`min-h-20 p-2.5 text-left ${
                  reservation ? "bg-[#EFEBE2]" : "bg-white"
                } ${
                  isMine
                    ? "cursor-pointer ring-1 ring-inset ring-[#E63946]/35 transition hover:bg-[#E63946]/10"
                    : "cursor-default"
                }`}
              >
                <p className="text-xs font-bold text-[#1A1428]">
                  {slot}
                </p>

                {reservation ? (
                  <>
                    <div className="mt-2 flex min-w-0 items-center gap-1.5">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#E63946] text-[9px] font-bold text-white">
                        {memberInitial}
                      </span>

                      <span className="truncate text-[11px] font-semibold text-[#8B8575]">
                        {reservation.memberName}
                      </span>
                    </div>

                    {isMine && (
                      <p className="mt-1 text-[10px] font-bold text-[#E63946]">
                        클릭하여 취소
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-[11px] font-semibold text-[#06A77D]">
                    예약 가능
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      <footer className="border-t border-[#1A1428]/10 bg-[#EFEBE2]/25 px-5 py-3">
        <p className="text-[11px] leading-5 text-[#8B8575]">
          내 예약을 선택하면 기존 예약 취소 확인창이 열립니다.
        </p>
      </footer>
    </section>
  );
}

export default ReservationList;