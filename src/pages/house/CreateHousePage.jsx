import { useState } from "react";
import { useNavigate } from "react-router";

function CreateHousePage() {
    const navigate = useNavigate();

    const [houseName, sethouseName] = useState("");
    const [address, setaddress] = useState("");

    function handleSubmit(e) {
        e.preventDefault()
        console.log("제출된 데이터:", {houseName, address})
        navigate("/invite-house");
    }

    return(
        <main>
            <span>✨</span>
            <h1>새 하우스 만들기</h1>
            <p>하우스 정보를 입력하면 초대코드가 생성돼요</p>

            <form onSubmit={handleSubmit}>

                {/* 하우스 이름 (필수정보) */}
                <div>
                    <label htmlFor="house-name">하우스 이름 *</label>
                    <input
                    id="house-name"
                    type="text"
                    value={houseName}
                    onChange={(e) => sethouseName(e.target.value)}
                    placeholder="예: 강남 쉐어하우스"
                    required
                    />
                </div>

                {/* 하우스 주소 (선택정보) */}
                <div>
                    <label htmlFor="house-address">하우스 주소 (선택)</label>
                    <input
                    id="house-address"
                    type="text"
                    value={address}
                    onChange={(e) => setaddress(e.target.value)}
                    placeholder="예: 서울시 강남구 역삼동"
                    />
                </div>

                {/* 인원 선택 버튼은 굳이 쓸데가 없을것 같아 미구현 */}

                {/* 하우스 만들기 완료 버튼*/}
                <button type="submit">하우스 만들기</button>
            </form>
        </main>
    );
}

export default CreateHousePage;