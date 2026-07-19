import { Link } from "react-router";

function Sidebar() {
    return(
        <nav>
            <h3>같이살기</h3>
            <ul>
                <li><Link to="/home">홈</Link></li>
                <li><Link to="/rotation">로테이션</Link></li>
            </ul>
            <div>
                {/* 추후 백엔드에서 사용자 정보 가져올 예정 */}
                <p>김지수 (강남 쉐어하우스)</p>
            </div>
        </nav>
    );
}

export default Sidebar;