import { useState } from "react";
import { useNavigate } from "react-router";

function JoinHousePage() {
    const [typedCode, setTypedCode] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        // 1. 공백 제거 및 대문자 변환 (사용자 편의성 위함)
        const cleanCode = typedCode.trim().toUpperCase();
        console.log("입력된 초대코드:", cleanCode);

        // 2. 임시 유효성 검사 (6자리 코드가 맞는지 확인)
        if (cleanCode.length !== 6) {
            alert("초대코드는 6자리여야 합니다. 다시 확인해 주세요! 🔍");
            return;
        }

        // 3. 백엔드 연결 전 임시 통과 처리
        alert("하우스 입장에 성공했습니다! 🎉");
        navigate("/main"); // 가입 성공 후 메인 화면으로 이동
    }

    return(
        <main>
            <span>🏠</span>
            <h1>하우스 참여하기</h1>
            <p>공유받은 6자리 초대코드를 입력해 주세요.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="invite-code-input">초대코드 입력</label>
                    <input
                    id="invite-code-input"
                    type="text"
                    value={typedCode}
                    onChange={(e) => setTypedCode(e.target.value.toUpperCase())} // 소문자 -> 대문자로 바로 바뀜
                    placeholder="예: DT6K9P"
                    maxLength="6" //6자로 제한
                    required
                    />
                </div>

                <button type="submit">하우스 입장하기</button>
            </form>    
        </main>
    );
}

export default JoinHousePage;