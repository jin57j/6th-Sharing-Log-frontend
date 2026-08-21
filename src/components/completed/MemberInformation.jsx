import MemberAvatar from "../member/MemberAvatar";

export default function MemberInformation({ label, member }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-[#8B8575]">{label}</p>

      {member ? (
        <div className="mt-1.5 flex items-center gap-2">
          <MemberAvatar
            name={member.displayName}
            memberId={member.membershipId}
            size="sm"
          />

          <p className="min-w-0 truncate text-sm font-bold">
            {member.displayName}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm font-semibold text-[#8B8575]">없음</p>
      )}
    </div>
  );
}
