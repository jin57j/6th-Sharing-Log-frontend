import { useState } from "react";

import { RESERVATION_TIME_SLOTS } from "../../constants/reservation";

function ReservationForm({
  spaces,
  selectedSpaceId,
  setSelectedSpaceId,
  today,
  selectedDate,
  setSelectedDate,
  onSubmit,
}) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");

  function handleStartTimeChange(event) {
    const newStartTime = event.target.value;
    const startIndex = RESERVATION_TIME_SLOTS.indexOf(newStartTime);

    setStartTime(newStartTime);

    // 시작 시간이 종료 시간보다 늦어지면
    // 종료 시간을 시작 시간 30분 뒤로 자동 변경
    if (endTime <= newStartTime) {
      setEndTime(RESERVATION_TIME_SLOTS[startIndex + 1]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      selectedSpaceId,
      selectedDate,
      startTime,
      endTime,
    });
  }

  const inputStyle =
    "mt-1.5 w-full rounded-xl border border-[#1A1428]/10 bg-white px-3 py-2.5 text-sm text-[#1A1428] outline-none transition focus:border-[#E63946]/40 focus:ring-2 focus:ring-[#E63946]/15";

  const labelStyle =
    "block text-[11px] font-bold text-[#8B8575]";

  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-5">
      <header>
        <p className="text-xs font-bold text-[#E63946]">
          RESERVATION
        </p>

        <h2 className="mt-1 font-display text-lg font-black text-[#1A1428]">
          예약 정보 입력
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#8B8575]">
          공간과 날짜를 선택하고 사용할 시간을 입력해 주세요.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label htmlFor="space" className={labelStyle}>
            공용공간

            <select
              id="space"
              value={selectedSpaceId}
              onChange={(event) =>
                setSelectedSpaceId(event.target.value)
              }
              required
              className={inputStyle}
            >
              {spaces.map((space) => (
                <option key={space.spaceId} value={space.spaceId}>
                  {space.name}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="date" className={labelStyle}>
            날짜

            <input
              id="date"
              type="date"
              min={today}
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(event.target.value)
              }
              required
              className={inputStyle}
            />
          </label>
        </div>

        <div className="mt-6 border-t border-[#1A1428]/10 pt-5">
          <p className="text-sm font-bold text-[#1A1428]">
            사용 시간

            <span className="ml-1 text-xs font-normal text-[#8B8575]">
              · 최소 30분
            </span>
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label htmlFor="start-time" className={labelStyle}>
              시작 시간

              <select
                id="start-time"
                value={startTime}
                onChange={handleStartTimeChange}
                required
                className={inputStyle}
              >
                {RESERVATION_TIME_SLOTS.slice(0, -1).map(
                  (time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label htmlFor="end-time" className={labelStyle}>
              종료 시간

              <select
                id="end-time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                required
                className={inputStyle}
              >
                {RESERVATION_TIME_SLOTS.filter(
                  (time) => time > startTime,
                ).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={!selectedSpaceId}
              className="self-end rounded-xl bg-[#E63946] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              예약하기
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[#8B8575]">
            예약은 오전 9시부터 오후 9시까지 30분 단위로
            가능합니다.
          </p>
        </div>
      </form>
    </section>
  );
}

export default ReservationForm;