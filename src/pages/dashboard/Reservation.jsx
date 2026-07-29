import ReservationForm from "../../components/reservation/ReservationForm";
import ReservationList from "../../components/reservation/ReservationList";
import SpaceForm from "../../components/reservation/SpaceForm";
import useReservation from "../../hooks/useReservation";

function Reservation() {
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

  const selectedSpace = spaces.find(
    (space) =>
      String(space.spaceId) === String(selectedSpaceId),
  );

  return (
    <main className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-4xl p-5 pb-8 sm:p-8">
        <header>
          <p className="text-sm text-[#8B8575]">
            우리 집 공용공간을 겹치지 않게
          </p>

          <h1 className="mt-1 font-display text-[30px] font-black tracking-[-0.03em]">
            공간 예약
          </h1>
        </header>

        <div className="mt-7 space-y-6">
          <ReservationForm
            spaces={spaces}
            selectedSpaceId={selectedSpaceId}
            setSelectedSpaceId={setSelectedSpaceId}
            today={today}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onSubmit={handleReservation}
          />

          <SpaceForm onAddSpace={handleAddSpace} />

          {message && (
            <p
              role="status"
              className="rounded-xl border border-[#E63946]/15 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#1A1428]"
            >
              {message}
            </p>
          )}

          <ReservationList
            selectedDate={selectedDate}
            selectedSpaceName={
              selectedSpace?.name ?? "공간을 선택해 주세요"
            }
            loading={loading}
            reservations={reservations}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </main>
  );
}

export default Reservation;