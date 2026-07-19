import { mockMyTasks, mockNotices } from "../../mocks/homeData";

// 두가지는 컴포넌트로 분리해둠
import TaskCard from "../../components/TaskCard";
import NoticeItem from "../../components/NoticeItem";

function Home() {
    const userName = "지수";
    const today = "2026년 7월 19일 · 일요일";
     // 임시로 하드코딩

    return(
        <div>
            <header>
                <p>{today}</p>
                <h1>안녕하세요, {userName}님 👋</h1>
                <button>🔔</button>
            </header>

            <hr />

            <section>
                <header>
                    <h2>🔴 오늘과 이번 주, 내 업무</h2>
                    <p>완료하면 홈에서 사라지고 완료 업무에서 다시 볼 수 있어요.</p>
                    <span>{mockMyTasks.length}개 남음</span>
                </header>

                <ul>
                    {mockMyTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </ul>
            </section>

            <hr />
            
            <section>
                <header>
                    <h2>최근 공지</h2>
                    <button>전체 보기</button>
                </header>

                <ul>
                    {mockNotices.map((notice) => (
                        <NoticeItem key={notice.id} notice={notice} />
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Home;