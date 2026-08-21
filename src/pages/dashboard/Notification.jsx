import DeadlineNotificationSection from "../../components/notification/DeadlineNotificationSection";
import NotificationLoading from "../../components/notification/NotificationLoading";
import NotificationPageHeader from "../../components/notification/NotificationPageHeader";
import SubstituteNotificationSection from "../../components/notification/SubstituteNotificationSection";
import useNotificationPage from "../../hooks/useNotificationPage";

export default function Notification() {
  const page = useNotificationPage();

  if (page.isLoading) {
    return <NotificationLoading />;
  }

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-4xl p-5 pb-8 sm:p-8">
        <NotificationPageHeader onReload={page.onReload} />

        {page.errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#E63946]"
          >
            {page.errorMessage}
          </p>
        )}

        <DeadlineNotificationSection {...page.deadlines} />
        <SubstituteNotificationSection {...page.substitutes} />
      </div>
    </div>
  );
}
