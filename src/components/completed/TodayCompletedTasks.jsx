import { CheckCircle2 } from "lucide-react";

import { getChoreIcon } from "../../utils/choreUtils";

function formatCompletedTime(closedAt) {
  if (!closedAt) {
    return "";
  }

  const date = new Date(closedAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(
    "ko-KR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export default function TodayCompletedTasks({
  occurrences,
  processingOccurrenceId,
  onUndoComplete,
}) {
  return (
    <section className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <CheckCircle2
          size={20}
          className="text-[#2E9B62]"
          aria-hidden="true"
        />
        <h2 className="font-display text-lg font-black">
          오늘 완료한 업무
        </h2>
      </div>

      <p className="mt-1 text-xs leading-5 text-[#8B8575]">
        실수로 완료한 업무를 빠르게 취소할 수 있어요.
      </p>

      {occurrences.length === 0 ? (
        <p className="mt-5 rounded-xl bg-[#F8F4EE] px-4 py-6 text-center text-sm font-semibold text-[#8B8575]">
          오늘 완료한 업무가 없어요.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {occurrences.map(
            (occurrence) => {
              const isProcessing =
                processingOccurrenceId ===
                occurrence.occurrenceId;

              return (
                <li
                  key={
                    occurrence.occurrenceId
                  }
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F4EE] p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="w-10 shrink-0 text-center text-3xl leading-none"
                    >
                      {getChoreIcon(
                        occurrence.choreName,
                      )}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {
                          occurrence.choreName
                        }
                      </p>
                      <p className="mt-1 text-xs text-[#8B8575]">
                        {formatCompletedTime(
                          occurrence.closedAt,
                        )}{" "}
                        완료
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() =>
                      onUndoComplete(
                        occurrence,
                      )
                    }
                    className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing
                      ? "처리 중..."
                      : "완료 취소"}
                  </button>
                </li>
              );
            },
          )}
        </ul>
      )}
    </section>
  );
}
