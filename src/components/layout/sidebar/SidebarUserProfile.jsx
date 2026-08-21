import { ArrowLeftRight, LogOut } from "lucide-react";
import { NavLink } from "react-router";

function UserAvatar({ nickname }) {
  const initial = nickname?.trim()
    ? Array.from(nickname.trim())[0]
    : "?";

  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E63946] text-xs font-bold text-white">
      {initial}
    </span>
  );
}

function SidebarUserProfile({
  nickname,
  houseName,
  isProfileLoading,
  profileErrorMessage,
  isLoggingOut,
  onLogout,
  onNavigate,
}) {
  const displayedNickname = isProfileLoading
    ? "불러오는 중..."
    : nickname || "사용자";
  const displayedHouseName = isProfileLoading
    ? "하우스 확인 중..."
    : profileErrorMessage
      ? "정보를 불러오지 못했어요"
      : houseName || "참여 중인 하우스 없음";

  return (
    <div className="mt-auto border-t border-[#1A1428]/10 pt-4">
      <div className="flex items-center gap-3 px-2">
        <UserAvatar nickname={nickname} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#1A1428]">
            {displayedNickname}
          </p>
          <p className="truncate text-xs text-[#8B8575]">
            {displayedHouseName}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <NavLink
            to="/house-choice"
            onClick={onNavigate}
            aria-label="하우스 선택"
            title="하우스 선택"
            className="rounded-lg p-1.5 text-[#8B8575] transition-colors hover:bg-[#EFEBE2] hover:text-[#1A1428]"
          >
            <ArrowLeftRight size={16} aria-hidden="true" />
          </NavLink>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            aria-label={isLoggingOut ? "로그아웃 처리 중" : "로그아웃"}
            title="로그아웃"
            className="rounded-lg p-1.5 text-[#8B8575] transition-colors hover:bg-[#EFEBE2] hover:text-[#1A1428] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarUserProfile;
