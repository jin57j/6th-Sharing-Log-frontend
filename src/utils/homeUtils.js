export function filterPendingTasks(occurrences, now = new Date()) {
  return occurrences.filter((task) => {
    const isNotCompleted = task.status !== "COMPLETED";
    const isPastDue = task.dueAt ? new Date(task.dueAt) < now : false;

    return isNotCompleted && !isPastDue;
  });
}
