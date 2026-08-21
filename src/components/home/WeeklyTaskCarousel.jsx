import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import TaskCard from "../common/TaskCard";

export default function WeeklyTaskCarousel({
  tasks,
  onComplete,
  onRequestSubstitute,
}) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const safeIndex = Math.min(
    currentIndex,
    tasks.length - 1,
  );

  const currentTask =
    tasks[safeIndex];

  const canShowPrevious =
    safeIndex > 0;

  const canShowNext =
    safeIndex < tasks.length - 1;

  function showPreviousTask() {
    if (!canShowPrevious) {
      return;
    }

    setCurrentIndex(safeIndex - 1);
  }

  function showNextTask() {
    if (!canShowNext) {
      return;
    }

    setCurrentIndex(safeIndex + 1);
  }

  return (
    <>
      <div className="sm:hidden">
        <ul>
          <TaskCard
            key={currentTask.occurrenceId}
            task={currentTask}
            onComplete={onComplete}
            onRequestSubstitute={
              onRequestSubstitute
            }
          />
        </ul>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={showPreviousTask}
            disabled={!canShowPrevious}
            aria-label="이전 업무 보기"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#1A1428] shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft
              size={20}
              aria-hidden="true"
            />
          </button>

          <p className="min-w-12 text-center text-xs font-bold text-[#8B8575]">
            {safeIndex + 1} / {tasks.length}
          </p>

          <button
            type="button"
            onClick={showNextTask}
            disabled={!canShowNext}
            aria-label="다음 업무 보기"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#1A1428] shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <ul className="hidden gap-4 overflow-x-auto pb-2 sm:flex">
        {tasks.map((task) => (
          <TaskCard
            key={task.occurrenceId}
            task={task}
            onComplete={onComplete}
            onRequestSubstitute={
              onRequestSubstitute
            }
          />
        ))}
      </ul>
    </>
  );
}
