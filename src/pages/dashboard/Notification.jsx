import { BellRing, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";

import useNotificationContext from "../../hooks/useNotificationContext";
import DeadlineCard from "../../components/notification/DeadlineCard";
import SubstituteRequestCard from "../../components/notification/SubstituteRequestCard";

function EmptyMessage({ children }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white px-5 py-10 text-center text-sm font-bold text-gray-500 shadow-sm">
      {children}
    </div>
  );
}

export default function Notification() {
  const navigate = useNavigate();

  const {
    deadlineItems,
    substituteRequests,
    loading,
    respondingRequestId,
    errorMessage,
    reload,
    handleSubstituteResponse,
  } = useNotificationContext();

  if (loading) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p role="status" className="text-sm font-semibold text-[#8B8575]">
          알림을 불러오는 중이에요...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-4xl p-5 pb-8 sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#8B8575]">
              내가 확인해야 할 업무와 대타 요청이에요
            </p>
            <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
              <BellRing size={27} aria-hidden="true" />
              알림
            </h1>
          </div>

          <button
            type="button"
            onClick={reload}
            aria-label="알림 새로고침"
            className="rounded-xl border border-[#1A1428]/10 bg-white p-3 text-[#8B8575] transition hover:text-[#1A1428]"
          >
            <RefreshCw size={18} aria-hidden="true" />
          </button>
        </header>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#E63946]"
          >
            {errorMessage}
          </p>
        )}

        {/* 마감 임박 섹션 */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-xl font-black">마감 임박</h2>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#FFB703] px-1.5 text-xs font-black text-[#1A1428]">
              {deadlineItems.length}
            </span>
          </div>

          {deadlineItems.length === 0 ? (
            <EmptyMessage>현재 마감이 가까운 담당 업무가 없어요.</EmptyMessage>
          ) : (
            <div className="space-y-3">
              {deadlineItems.map((item) => (
                <DeadlineCard
                  key={item.occurrenceId}
                  item={item}
                  onClick={() => navigate("/task")}
                />
              ))}
            </div>
          )}
        </section>

        {/* 대타 요청 섹션 */}
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-xl font-black">대타 요청</h2>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#E63946] px-1.5 text-xs font-black text-white">
              {substituteRequests.filter((req) => !req.myResponse).length}
            </span>
          </div>

          {substituteRequests.length === 0 ? (
            <EmptyMessage>현재 확인할 대타 요청이 없어요.</EmptyMessage>
          ) : (
            <div className="space-y-4">
              {substituteRequests.map((request) => (
                <SubstituteRequestCard
                  key={request.requestId}
                  request={request}
                  responding={respondingRequestId === request.requestId}
                  onAccept={() => handleSubstituteResponse(request.requestId, "accept")}
                  onReject={() => handleSubstituteResponse(request.requestId, "reject")}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
