function TaskCard({ task }) {
    return (
        <li>
            <div>
                <span>{task.icon}</span>
                <span>⏱️ {task.timeLeft}</span>
            </div>
            <h3>{task.title}</h3>
            <p>{task.frequency}</p>
            
            <div>
                <button type="button">🤝 대타 요청</button>
                <button type="button">✔️ 업무 완료</button>
            </div>
        </li>
    );
}

export default TaskCard;