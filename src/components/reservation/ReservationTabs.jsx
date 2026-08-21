import { CalendarDays, Settings2 } from "lucide-react";

const RESERVATION_TABS = [
  { id: "reservation", label: "공간 예약", icon: CalendarDays },
  { id: "management", label: "공간 관리", icon: Settings2 },
];

function ReservationTabs({ activeTab, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="공간 예약 메뉴"
      className="mt-7 grid grid-cols-2 rounded-2xl bg-[#EFEBE2] p-1"
    >
      {RESERVATION_TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              isActive
                ? "bg-white text-[#E63946] shadow-sm"
                : "text-[#8B8575] hover:text-[#1A1428]"
            }`}
          >
            <Icon
              size={17}
              strokeWidth={isActive ? 2.5 : 2}
              aria-hidden="true"
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default ReservationTabs;
