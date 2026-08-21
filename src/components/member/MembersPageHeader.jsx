import { Users } from "lucide-react";

function MembersPageHeader({ houseName, memberCount, ownerCount }) {
  return (
    <>
      <header>
        <p className="text-sm text-[#8B8575]">{houseName}의 참여 멤버</p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
          <Users size={28} aria-hidden="true" />
          멤버
        </h1>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#EFEBE2] px-3 py-1.5 text-xs font-bold text-[#8B8575]">
          전체 {memberCount}명
        </span>
        <span className="rounded-full bg-[#E63946]/10 px-3 py-1.5 text-xs font-bold text-[#E63946]">
          관리자 {ownerCount}명
        </span>
      </div>
    </>
  );
}

export default MembersPageHeader;
