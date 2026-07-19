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