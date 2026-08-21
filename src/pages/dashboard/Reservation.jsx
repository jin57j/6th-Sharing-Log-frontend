import { useOutletContext } from "react-router";

import ReservationPageHeader from "../../components/reservation/ReservationPageHeader";
import ReservationPageStatus from "../../components/reservation/ReservationPageStatus";
import ReservationPanels from "../../components/reservation/ReservationPanels";
import ReservationTabs from "../../components/reservation/ReservationTabs";
import useReservationPage from "../../hooks/useReservationPage";

function Reservation() {
  const { profile } = useOutletContext();
  const page = useReservationPage(profile);

  if (page.status.isLoading || page.status.errorMessage) {
    return <ReservationPageStatus {...page.status} />;
  }

  return (
    <main className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-4xl p-5 pb-8 sm:p-8">
        <ReservationPageHeader />
        <ReservationTabs
          activeTab={page.tabs.activeTab}
          onChange={page.tabs.onChange}
        />

        {page.message && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-[#E63946]/15 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#1A1428]"
          >
            {page.message}
          </p>
        )}

        <ReservationPanels
          activeTab={page.tabs.activeTab}
          reservationPanel={page.reservationPanel}
          managementPanel={page.managementPanel}
        />
      </div>
    </main>
  );
}

export default Reservation;
