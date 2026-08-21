import { useOutletContext } from "react-router";

import CalendarGrid from "../../components/calendar/CalendarGrid";
import CalendarMonthHeader from "../../components/calendar/CalendarMonthHeader";
import CalendarPageHeader from "../../components/calendar/CalendarPageHeader";
import CalendarScopeTabs from "../../components/calendar/CalendarScopeTabs";
import CalendarStatus from "../../components/calendar/CalendarStatus";
import OccurrenceList from "../../components/calendar/OccurrenceList";
import useCalendarPage from "../../hooks/useCalendarPage";

function Calendar({ embedded = false }) {
  const { activeGroup } =
    useOutletContext();

  const page =
    useCalendarPage(activeGroup);

  const canShowCalendar =
    !page.status.isLoading &&
    !page.status.errorMessage;

  return (
    <div
      id={embedded ? "home-calendar" : undefined}
      className={
        embedded
          ? "mb-12 text-[#1A1428]"
          : "min-h-full text-[#1A1428]"
      }
    >
      <div
        className={
          embedded
            ? ""
            : "mx-auto max-w-2xl p-5 pb-8 sm:p-8"
        }
      >
        <CalendarPageHeader
          houseName={page.houseName}
          embedded={embedded}
        />

        <CalendarScopeTabs
          calendarTab={
            page.calendarTab
          }
          onChange={page.changeTab}
        />

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm">
          <CalendarMonthHeader
            {...page.month}
          />

          <CalendarStatus
            {...page.status}
          />

          {canShowCalendar && (
            <>
              <CalendarGrid
                {...page.grid}
              />

              {page.selectedDate && (
                <OccurrenceList
                  {...page.selectedDate}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Calendar;
