import useReservation from "../../hooks/useReservation";
import ReservationForm from "../../components/reservation/ReservationForm";
import ReservationList from "../../components/reservation/ReservationList";
import SpaceForm from "../../components/reservation/SpaceForm";

function Reservation() {
  // 로직과 상태를 커스텀 훅으로 들고옴
  const {
    today,
    spaces,
    selectedSpaceId,
    setSelectedSpaceId,
    selectedDate,
    setSelectedDate,
    reservations,
    loading,
    message,
    handleAddSpace,
    handleReservation,
    handleCancel,
  } = useReservation();

  return (
    <main>
      <header>
        <h1>공간 예약</h1>
        <p>공용 공간의 사용 시간을 예약할 수 있습니다.</p>
      </header>

      <hr />

      <SpaceForm onAddSpace={handleAddSpace} />

      <hr />

      <ReservationForm
        spaces={spaces}
        selectedSpaceId={selectedSpaceId}
        setSelectedSpaceId={setSelectedSpaceId}
        today={today}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSubmit={handleReservation}
      />

      {message && <p role="status">{message}</p>}

      <hr />

      <ReservationList
        selectedDate={selectedDate}
        loading={loading}
        reservations={reservations}
        onCancel={handleCancel}
      />
    </main>
  );
}

export default Reservation;