import { useState } from "react";

// 모의 데이터 불러오기
import { mockTasks, mockWeeks } from "../../mocks/rotationData";

// 유틸파일에 있는 로테이션 계산 함수 불러오기
import { getAssignee } from "../../utils/rotationUtils";

const frequencyOptions = [
  {
      value: "DAILY",
      label: "매일 업무",
  },
  {
      value: "WEEKLY",
      label: "매주 업무",
  },
  {
      value: "BIWEEKLY",
      label: "격주 업무",
  },
];

// 주차별 리스트를 그리는 함수
// week: MOCKDATA의 mockWeeks 배열에서 하나씩 꺼낸 한 주차 데이터
// tasks: 화면에 띄울 할일 목록
// weekIndex: 0(이번주), 1(1주 후)같은 순서 숫자
function WeeklyList({ week, tasks, weekIndex }) {
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

// 메인 로테이션 화면
function Rotation() {
  const [selectedFrequency, setSelectedFrequency] = useState("WEEKLY");
  
  const filteredTasks = mockTasks.filter(
    (task) => task.frequency === selectedFrequency
  );

  return (
    <section>
      <p>우리 집 당번을 한눈에</p>
      <h1>업무 로테이션</h1>

      {/* 업무 주기 선택 버튼 구역 */}
      <div>
        {frequencyOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedFrequency(option.value)}
            style={{ fontWeight: selectedFrequency === option.value ? "bold" : "normal" }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p>로테이션은 구성원 순서대로 자동 배정돼요.</p>

      {/* 주차별 리스트 반복 구역 */}
      <div>
        {mockWeeks.map((week, weekIndex) => (
          <WeeklyList 
            key={week.weekId} 
            week={week} 
            tasks={filteredTasks} 
            weekIndex={weekIndex} 
          />
        ))}
      </div>
    </section>
  );
}

export default Rotation;