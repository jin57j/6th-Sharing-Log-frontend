import { useState } from "react";

import { rotationApi } from "../api/rotationApi";

function useCompletedOccurrenceActions({
  groupId,
  onReload,
}) {
  const [
    processingOccurrenceId,
    setProcessingOccurrenceId,
  ] = useState("");

  async function handleComplete(
    occurrence,
  ) {
    const confirmed = window.confirm(
      `'${occurrence.choreName}' 업무를 완료하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingOccurrenceId(
      occurrence.occurrenceId,
    );

    try {
      await rotationApi.completeOccurrence(
        groupId,
        occurrence.occurrenceId,
        occurrence.version,
      );
      onReload();
    } catch (error) {
      console.error(
        "업무 완료 실패:",
        error,
      );
      window.alert(
        "업무 완료 처리에 실패했습니다.",
      );
    } finally {
      setProcessingOccurrenceId("");
    }
  }

  async function handleUndoComplete(
    occurrence,
  ) {
    const confirmed = window.confirm(
      `'${occurrence.choreName}' 업무 완료를 취소하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingOccurrenceId(
      occurrence.occurrenceId,
    );

    try {
      await rotationApi.undoComplete(
        groupId,
        occurrence.occurrenceId,
        occurrence.version,
      );
      onReload();
    } catch (error) {
      console.error(
        "완료 취소 실패:",
        error,
      );
      window.alert(
        "완료 취소 처리에 실패했습니다.",
      );
    } finally {
      setProcessingOccurrenceId("");
    }
  }

  return {
    processingOccurrenceId,
    handleComplete,
    handleUndoComplete,
  };
}

export default useCompletedOccurrenceActions;
