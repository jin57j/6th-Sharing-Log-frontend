function ReservationList({ selectedDate, loading, reservations, onCancel }) {
  return (
    <section>
      <h2>예약 목록</h2>

      <p>{selectedDate}</p>

      {loading ? (
        <p>예약을 불러오는 중입니다.</p>
      ) : reservations.length === 0 ? (
        <p>등록된 예약이 없습니다.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.reservationId}>
              <strong>{reservation.spaceName}</strong>

              <span>
                {" "}
                {reservation.startTime} ~ {reservation.endTime}
              </span>

              <span>
                {" "}
                · {reservation.memberName}
              </span>

              {reservation.mine && (
                <button
                  type="button"
                  onClick={() => onCancel(reservation)}
                >
                  예약 취소
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReservationList;