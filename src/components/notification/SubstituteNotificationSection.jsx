import NotificationEmptyMessage from "./NotificationEmptyMessage";
import SubstituteRequestCard from "./SubstituteRequestCard";

function SubstituteNotificationSection({
  requests,
  pendingCount,
  respondingRequestId,
  onAccept,
  onReject,
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-black">대타 요청</h2>
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#E63946] px-1.5 text-xs font-black text-white">
          {pendingCount}
        </span>
      </div>

      {requests.length === 0 ? (
        <NotificationEmptyMessage>
          현재 확인할 대타 요청이 없어요.
        </NotificationEmptyMessage>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <SubstituteRequestCard
              key={request.requestId}
              request={request}
              responding={respondingRequestId === request.requestId}
              onAccept={() => onAccept(request.requestId)}
              onReject={() => onReject(request.requestId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SubstituteNotificationSection;
