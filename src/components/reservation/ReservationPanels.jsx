import ReservationForm from "./ReservationForm";
import ReservationList from "./ReservationList";
import SpaceForm from "./SpaceForm";

function ReservationPanels({ activeTab, reservationPanel, managementPanel }) {
  return (
    <>
      {activeTab === "reservation" && (
        <div role="tabpanel" className="mt-6 space-y-6">
          <ReservationForm {...reservationPanel.form} />
          <ReservationList {...reservationPanel.list} />
        </div>
      )}

      {activeTab === "management" && (
        <div role="tabpanel" className="mt-6">
          <SpaceForm {...managementPanel} />
        </div>
      )}
    </>
  );
}

export default ReservationPanels;
