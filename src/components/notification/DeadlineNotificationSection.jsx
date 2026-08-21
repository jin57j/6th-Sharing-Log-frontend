import DeadlineCard from "./DeadlineCard";
import NotificationEmptyMessage from "./NotificationEmptyMessage";

function DeadlineNotificationSection({ items, onSelect }) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-black">마감 임박</h2>
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#FFB703] px-1.5 text-xs font-black text-[#1A1428]">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <NotificationEmptyMessage>
          현재 마감이 가까운 담당 업무가 없어요.
        </NotificationEmptyMessage>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <DeadlineCard
              key={item.occurrenceId}
              item={item}
              onClick={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default DeadlineNotificationSection;
