import {
  ShieldCheck,
  Users,
} from "lucide-react";

import usePromoteMember from "../../hooks/usePromoteMember";
import InvitationReissueControl from "./InvitationReissueControl";
import MemberAvatar from "../member/MemberAvatar";

function MemberPromotionSection({
  house,
  members,
  canManage,
  isLoading,
  memberErrorMessage,
  onMemberRoleUpdated,
}) {
  const {
    promotingMembershipId,
    errorMessage,
    handlePromote,
  } = usePromoteMember({
    groupPublicId:
      house?.groupPublicId ?? "",
    onSuccess: onMemberRoleUpdated,
  });

  const promotableMembers = members.filter(
    (member) =>
      member.role === "MEMBER",
  );

  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Users
          size={21}
          aria-hidden="true"
        />

        <h2 className="text-lg font-black">
          기타 설정
        </h2>
      </div>

      <p className="mt-1 text-sm leading-6 text-[#8B8575]">
        하우스 초대와 멤버 권한을 관리할 수
        있어요.
      </p>

      {/* 초대 링크 재발급 */}
      <div className="mt-6 border-t border-[#1A1428]/10 pt-5">
        <InvitationReissueControl
          house={house}
        />
      </div>

      {/* 관리자 지정 */}
      <div className="mt-6 border-t border-[#1A1428]/10 pt-5">
        <div className="flex items-center gap-2">
          <ShieldCheck
            size={18}
            aria-hidden="true"
          />

          <h3 className="font-bold">
            관리자 지정
          </h3>
        </div>

        <p className="mt-1 text-xs leading-5 text-[#8B8575]">
          관리자로 지정된 멤버는 하우스 정보를
          수정하고 관리 기능을 사용할 수 있어요.
        </p>

        {!house && (
          <p className="mt-4 rounded-xl bg-[#F8F4EE] px-4 py-4 text-sm font-semibold text-[#8B8575]">
            참여 중인 하우스가 없어요.
          </p>
        )}

        {house && !canManage && (
          <p className="mt-4 rounded-xl bg-[#F8F4EE] px-4 py-4 text-sm font-semibold text-[#8B8575]">
            관리자만 멤버의 권한을 변경할 수
            있어요.
          </p>
        )}

        {house &&
          canManage &&
          isLoading && (
            <p
              role="status"
              className="mt-4 rounded-xl bg-[#F8F4EE] px-4 py-4 text-sm font-semibold text-[#8B8575]"
            >
              멤버 목록을 불러오는 중이에요...
            </p>
          )}

        {house &&
          canManage &&
          !isLoading &&
          memberErrorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
            >
              {memberErrorMessage}
            </p>
          )}

        {house &&
          canManage &&
          !isLoading &&
          !memberErrorMessage &&
          promotableMembers.length ===
            0 && (
            <p className="mt-4 rounded-xl bg-[#F8F4EE] px-4 py-4 text-sm font-semibold text-[#8B8575]">
              관리자로 지정할 일반 멤버가 없어요.
            </p>
          )}

        {house &&
          canManage &&
          !isLoading &&
          !memberErrorMessage &&
          promotableMembers.length >
            0 && (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#1A1428]/10">
              {promotableMembers.map(
                (member, index) => {
                  const isPromoting =
                    promotingMembershipId ===
                    member.membershipId;

                  return (
                    <div
                      key={
                        member.membershipId
                      }
                      className={`flex items-center gap-3 px-4 py-3 ${
                        index ===
                        promotableMembers.length -
                          1
                          ? ""
                          : "border-b border-[#1A1428]/10"
                      }`}
                    >
                      <MemberAvatar
                        name={
                          member.displayName
                        }
                        memberId={
                          member.membershipId
                        }
                        size="sm"
                      />

                      <p className="min-w-0 flex-1 truncate text-sm font-bold">
                        {member.displayName ||
                          "이름 없는 멤버"}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handlePromote(
                            member,
                          )
                        }
                        disabled={Boolean(
                          promotingMembershipId,
                        )}
                        className="shrink-0 rounded-lg border border-[#E63946] px-3 py-2 text-xs font-bold text-[#E63946] transition hover:bg-[#E63946] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPromoting
                          ? "변경 중..."
                          : "관리자로 지정"}
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          )}

        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}

export default MemberPromotionSection;