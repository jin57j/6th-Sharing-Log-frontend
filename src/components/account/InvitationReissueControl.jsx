import {
  Check,
  Clock3,
  Copy,
  Link2,
  RefreshCw,
} from "lucide-react";

import useReissueInvitation from "../../hooks/useReissueInvitation";
import {
  formatExpiry,
  makeReadableCode,
} from "../../utils/formatters";

function InvitationReissueControl({
  house,
}) {
  const {
    invitation,
    isReissuing,
    copiedTarget,
    errorMessage,
    handleReissue,
    copyInvitation,
  } = useReissueInvitation(
    house?.groupPublicId ?? "",
  );

  const isOwner =
    house?.role === "OWNER";

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link2
          size={18}
          aria-hidden="true"
        />

        <h3 className="font-bold">
          하우스 초대 링크
        </h3>
      </div>

      <p className="mt-1 text-xs leading-5 text-[#8B8575]">
        새로운 초대 코드를 발급해요.
      </p>

      {!house && (
        <p className="mt-4 rounded-xl bg-[#F8F4EE] px-4 py-4 text-sm font-semibold text-[#8B8575]">
          참여 중인 하우스가 없어요.
        </p>
      )}

      {house && !isOwner && (
        <p className="mt-4 rounded-xl bg-[#F8F4EE] px-4 py-4 text-sm font-semibold text-[#8B8575]">
          하우스 관리자만 초대 링크를 발급할 수
          있어요.
        </p>
      )}

      {house && isOwner && (
        <>
          <button
            type="button"
            onClick={handleReissue}
            disabled={isReissuing}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A1428]/15 bg-white px-4 py-3 text-sm font-bold transition hover:bg-[#EFEBE2] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              size={16}
              className={
                isReissuing
                  ? "animate-spin"
                  : ""
              }
              aria-hidden="true"
            />

            {isReissuing
              ? "발급하는 중..."
              : invitation
                ? "새 링크 다시 발급"
                : "새 초대 링크 발급"}
          </button>
        </>
      )}

      {invitation && (
        <div className="mt-5 rounded-xl border border-[#06D6A0]/30 bg-[#06D6A0]/5 p-4">
          <p className="text-xs font-black text-[#176555]">
            새로운 초대 링크가 발급됐어요
          </p>

          <div className="mt-3 rounded-xl bg-white px-4 py-4">
            <p className="text-[11px] font-bold text-[#8B8575]">
              초대코드
            </p>

            <p className="mt-1 break-words font-display text-base font-black tracking-[0.08em] text-[#E63946]">
              {makeReadableCode(
                invitation.code,
              )}
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                copyInvitation(
                  invitation.code,
                  "code",
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold transition hover:bg-[#EFEBE2]"
            >
              {copiedTarget === "code" ? (
                <Check
                  size={15}
                  className="text-[#06A77D]"
                  aria-hidden="true"
                />
              ) : (
                <Copy
                  size={15}
                  aria-hidden="true"
                />
              )}

              {copiedTarget === "code"
                ? "코드 복사 완료"
                : "초대코드 복사"}
            </button>

            <button
              type="button"
              onClick={() =>
                copyInvitation(
                  invitation.inviteUrl,
                  "link",
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold transition hover:bg-[#EFEBE2]"
            >
              {copiedTarget === "link" ? (
                <Check
                  size={15}
                  className="text-[#06A77D]"
                  aria-hidden="true"
                />
              ) : (
                <Link2
                  size={15}
                  aria-hidden="true"
                />
              )}

              {copiedTarget === "link"
                ? "링크 복사 완료"
                : "초대 링크 복사"}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#8B8575]">
            <Clock3
              size={14}
              aria-hidden="true"
            />

            <span>
              {formatExpiry(
                invitation.expiresAt,
              )}{" "}
              만료
            </span>
          </div>
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
  );
}

export default InvitationReissueControl;