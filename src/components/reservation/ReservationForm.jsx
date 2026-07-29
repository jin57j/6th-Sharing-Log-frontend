import { useState } from "react";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

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
    const startIndex = TIME_SLOTS.indexOf(newStartTime);

    setStartTime(newStartTime);

    // 시작 시간이 현재 종료 시간보다 늦어졌다면
    // 종료 시간을 시작 시간의 30분 뒤로 자동 변경함
    if (endTime <= newStartTime) {
      setEndTime(TIME_SLOTS[startIndex + 1]);
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

  return (
    <section>
      <h2>예약 정보 입력</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="space">공간</label>

          <select
            id="space"
            value={selectedSpaceId}
            onChange={(event) => setSelectedSpaceId(event.target.value)}
            required
          >
            {spaces.map((space) => (
              <option key={space.spaceId} value={space.spaceId}>
                {space.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date">날짜</label>

          <input
            id="date"
            type="date"
            min={today}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="start-time">시작 시간</label>

          <select
            id="start-time"
            value={startTime}
            onChange={handleStartTimeChange}
            required
          >
            {TIME_SLOTS.slice(0, -1).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="end-time">종료 시간</label>

          <select
            id="end-time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            required
          >
            {TIME_SLOTS.filter((time) => time > startTime).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <p>예약은 오전 9시부터 오후 9시까지 30분 단위로 가능합니다.</p>

        <button type="submit" disabled={!selectedSpaceId}>
          예약하기
        </button>
      </form>
    </section>
  );
}

export default ReservationForm;