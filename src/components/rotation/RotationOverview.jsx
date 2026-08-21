import RotationGuide from "./RotationGuide";
import RotationOverviewContent from "./RotationOverviewContent";
import RotationPageHeader from "./RotationPageHeader";

function RotationOverview({
  houseName,
  chores,
  occurrences,
  isLoading,
  errorMessage,
  onOpenCalendar,
}) {
  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        <RotationPageHeader houseName={houseName} />
        <RotationGuide />
        <RotationOverviewContent
          chores={chores}
          occurrences={occurrences}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onOpenCalendar={onOpenCalendar}
        />
      </div>
    </div>
  );
}

export default RotationOverview;
