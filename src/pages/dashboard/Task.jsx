import { useOutletContext } from "react-router";

import ChoreModal from "../../components/common/ChoreModal";
import TaskHeader from "../../components/task/TaskHeader";
import TaskList from "../../components/task/TaskList";
import useTaskPage from "../../hooks/useTaskPage";

function Task() {
  const { activeGroup } =
    useOutletContext();

  const page =
    useTaskPage(activeGroup);

  return (
    <div className="min-h-screen bg-[#F7F4EF] p-4 font-sans sm:p-8">
      <TaskHeader {...page.header} />

      <TaskList {...page.list} />

      {page.modal.isOpen && (
        <ChoreModal
          key={
            page.modal.editingChore
              ? page.modal
                  .editingChore
                  .choreId
              : "new-chore"
          }
          isOpen={page.modal.isOpen}
          onClose={page.modal.onClose}
          initialData={
            page.modal.editingChore
          }
          onSubmit={page.modal.onSubmit}
          groupId={page.modal.groupId}
        />
      )}
    </div>
  );
}

export default Task;
