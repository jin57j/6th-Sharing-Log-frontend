// 유틸파일에 있는 로테이션 계산 함수 불러오기
import { getAssignee } from "../../utils/rotationUtils";

// 주차별 리스트를 그리는 함수
// week: MOCKDATA의 mockWeeks 배열에서 하나씩 꺼낸 한 주차 데이터
// tasks: 화면에 띄울 할일 목록
// weekIndex: 0(이번주), 1(1주 후)같은 순서 숫자
export default function WeeklyList({ week, tasks, weekIndex }) {
  return (
    <section>
      <h2>{week.label}</h2>
      <ul>
        {tasks.map((task) => {
          // 여기서 유틸 함수의 계산 결과를 가져옴
          const assignee = getAssignee(task, weekIndex);
          return (
            <li key={task.taskId}>
              <span>{task.icon} </span>
              <strong>{task.name}</strong>
              <span> - 담당자: {assignee ? assignee.name : "미정"}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}