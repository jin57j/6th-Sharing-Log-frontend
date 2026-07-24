function NoticeItem({ notice, isLast }) {
  const dotColor = notice.isPinned ? "bg-[#E53E3E]" : "bg-[#ECC94B]";

  return (
    <li
      className={`flex items-start justify-between p-5 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* 상태 점 */}
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dotColor}`}></div>

        <div>
          <h4 className="mb-1 text-[15px] font-bold text-[#111]">
            {notice.title}
          </h4>
          <p className="text-[13px] text-[#888]">{notice.desc}</p>
        </div>
      </div>

      <span className="text-[13px] text-[#888] shrink-0 mt-0.5">
        {notice.date}
      </span>
    </li>
  );
}

export default NoticeItem;
