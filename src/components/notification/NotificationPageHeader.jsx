import { BellRing, RefreshCw } from "lucide-react";

function NotificationPageHeader({ onReload }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-[#8B8575]">
          내가 확인해야 할 업무와 대타 요청이에요
        </p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
          <BellRing size={27} aria-hidden="true" />
          알림
        </h1>
      </div>

      <button
        type="button"
        onClick={onReload}
        aria-label="알림 새로고침"
        className="rounded-xl border border-[#1A1428]/10 bg-white p-3 text-[#8B8575] transition hover:text-[#1A1428]"
      >
        <RefreshCw size={18} aria-hidden="true" />
      </button>
    </header>
  );
}

export default NotificationPageHeader;
