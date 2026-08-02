// 모의 데이터 불러오기
import { mockWeeks } from "../../mocks/rotationData";
import { FREQUENCY_OPTIONS } from "../../constants/rotation";
import useRotation from "../../hooks/useRotation";
import WeeklyList from "../../components/rotation/WeeklyList";

// 메인 로테이션 화면
function Rotation() {
  const { selectedFrequency, setSelectedFrequency, filteredTasks } =
    useRotation();

  return (
    <section>
      <p>우리 집 당번을 한눈에</p>
      <h1>업무 로테이션</h1>

      {/* 업무 주기 선택 버튼 구역 */}
      <div>
        {FREQUENCY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedFrequency(option.value)}
            style={{
              fontWeight:
                selectedFrequency === option.value ? "bold" : "normal",
            }}
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