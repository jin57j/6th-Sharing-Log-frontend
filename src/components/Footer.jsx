import { Link } from "react-router";

import { HiHome, HiRefresh, HiClipboardList, HiCalendar } from "react-icons/hi";

function Footer() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 pb-safe px-4 flex justify-around items-center z-50">
      <Link
        to="/home"
        className="flex flex-col items-center text-gray-500 hover:text-red-500"
      >
        <HiHome size={24} />
        <span className="text-xs mt-1">홈</span>
      </Link>
      <Link
        to="/rotation"
        className="flex flex-col items-center text-gray-500 hover:text-red-500"
      >
        <HiRefresh size={24} />
        <span className="text-xs mt-1">로테이션</span>
      </Link>
      <Link
        to="/task"
        className="flex flex-col items-center text-gray-500 hover:text-red-500"
      >
        <HiClipboardList size={24} />
        <span className="text-xs mt-1">업무 · 일정</span>
      </Link>
      <Link
        to="/reservation"
        className="flex flex-col items-center text-gray-500 hover:text-red-500"
      >
        <HiCalendar size={24} />
        <span className="text-xs mt-1">공간 예약</span>
      </Link>
    </nav>
  );
}

export default Footer;
