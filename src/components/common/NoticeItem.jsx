// 메인화면 공지 컴포넌트
function NoticeItem({ notice }) {
    return (
        <li>
            <div>
                <strong>🟡 {notice.title}</strong>
                <span>{notice.date}</span>
            </div>
            <p>{notice.desc}</p>
        </li>
    );
}

export default NoticeItem;