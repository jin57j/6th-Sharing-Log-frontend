import { useState} from "react";
import { useNavigate } from "react-router";

function InviteHousePage() {

    const navigate = useNavigate();
    // 랜덤 코드 생성은 추후 백엔드 구현 예정.. 일단 하드코딩으로 정해진 값을 넣어둠
    const [inviteCode, setInviteCode] = useState("DT6K9P");

    // 초대코드 복사하는 기능
    function handleCopyCode() {
        navigator.clipboard.writeText(inviteCode)
        .then(() => {
            alert("초대코드가 복사되었습니다! 🎉");
        })
        .catch(() => {
            alert("복사에 실패했습니다");
        });
    }

    // 메인 하우스로 들어가는 기능
    function handleStartHouse() {
        console.log("메인 화면으로 이동");
        navigate("/main")
    }

    return(
        <main>
            <span>🎉</span>
            <h2>하우스가 만들어졌어요!</h2>
            <p>아래 초대코드를 멤버에게 공유해요</p>

            <div>
                <span>초대코드</span>
                <div>{inviteCode}</div>

                <button onClick={handleCopyCode}>
                    코드 복사하기
                </button>
            </div>

            <p>
                멤버가 앱에서 "하우스에 참가하고 싶어요"를 선택한 뒤 이 코드를 입력하면 돼요.
            </p>

            <button onClick={handleStartHouse}>
                하우스 시작하기
            </button>
        </main>
    );
}

export default InviteHousePage;