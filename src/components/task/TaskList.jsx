import TaskItem from "./TaskItem";

function TaskList({
  chores,
  groupMembers,
  expandedChoreId,
  rotationMap,
  onToggleRotation,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
        <span className="text-xs font-bold text-gray-500 sm:text-sm">
          업무
        </span>

        <div className="flex gap-4 text-sm font-bold text-gray-500" />
      </div>

      {chores.length > 0 ? (
        <ul>
          {chores.map((chore) => (
            <TaskItem
              key={chore.choreId}
              chore={chore}
              groupMembers={
                groupMembers
              }
              isExpanded={
                expandedChoreId ===
                chore.choreId
              }
              rotationDisplayNames={
                rotationMap[
                  chore.choreId
                ]
              }
              onToggleRotation={
                onToggleRotation
              }
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : (
        <div className="py-12 text-center text-xs text-gray-400 sm:py-16 sm:text-sm">
          등록된 업무가 없습니다.
        </div>
      )}
    </div>
  );
}

export default TaskList;
