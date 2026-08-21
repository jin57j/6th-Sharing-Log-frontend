import { Link } from "react-router";

// 같이살기 로고 컴포넌트
export default function Logo({ onClick }) {
  return (
    <Link
      to="/home"
      onClick={onClick}
      aria-label="홈으로 이동"
      className="flex items-center gap-2.5 rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#E63946]/40"
    >
      <img
        src="/icons/app-icon-192.png"
        alt=""
        aria-hidden="true"
        className="h-9 w-9 object-contain"
      />
      <span className="font-display text-lg font-black tracking-[-0.02em] text-[#1A1428]">
        같이살기
      </span>
    </Link>
  );
}
