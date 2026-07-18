import { Link } from "react-router";

function SelectHousePage() {
    return(
        <main>
            <h1>어떻게 시작할까요?</h1>
            <p>새 하우스를 만들거나 초대코드로 참가할 수 있어요</p>

            <Link to="/create-house">
                <span>✨</span>
                <strong>새 하우스를 만들고 싶어요</strong>
                <span>하우스 정보를 입력하고 초대코드를 받아요</span>
                <span>시작하기</span>
            </Link>

            <Link to="/join-house">
                <span>🤝</span>
                <strong>하우스에 참가하고 싶어요</strong>
                <span>초대코드를 입력해서 기존 하우스에 들어가요</span>
                <span>코드 입력</span>
            </Link>
        </main>
    );
}

export default SelectHousePage;