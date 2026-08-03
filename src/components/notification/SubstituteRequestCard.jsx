import { Check, X } from "lucide-react";
import { formatDate } from "../../utils/date";

export default function SubstituteRequestCard({
  request,
  responding,
  onAccept,
  onReject,
}) {
  const hasResponded = Boolean(request.myResponse);

  return (
    <article className="rounded-2xl border border-[#1A1428]/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E63946] text-sm font-bold text-white">
          {request.requester.displayName.slice(0, 1)}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-[#8B8575]">
            <strong className="font-bold text-[#1A1428]">
              {request.requester.displayName}
            </strong>
            님의 대타 요청
          </p>

          <h3 className="mt-1 text-lg font-black text-[#1A1428]">
            {request.choreName}
          </h3>

          <p className="mt-3 rounded-xl bg-[#F8F4EE] px-4 py-3 text-sm leading-6 text-[#5F5A50]">
            {request.reason}
          </p>

          <p className="mt-3 text-xs text-[#8B8575]">
            요청 시간: {formatDate(request.createdAt)}
          </p>

          {hasResponded ? (
            <div
              role="status"
              className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                request.myResponse === "accept"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {request.myResponse === "accept" ? (
                <>
                  <Check size={17} aria-hidden="true" />
                  대타 요청을 수락했어요.
                </>
              ) : (
                <>
                  <X size={17} aria-hidden="true" />
                  대타 요청을 거절했어요.
                </>
              )}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onReject}
                disabled={responding}
                className="rounded-xl border border-[#1A1428]/10 px-4 py-3 text-sm font-bold text-[#8B8575] transition hover:bg-[#F8F4EE] disabled:cursor-not-allowed disabled:opacity-50"
              >
                어려워요
              </button>

              <button
                type="button"
                onClick={onAccept}
                disabled={responding}
                className="rounded-xl bg-[#E63946] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#D52E3B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {responding ? "처리 중..." : "제가 할게요"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}