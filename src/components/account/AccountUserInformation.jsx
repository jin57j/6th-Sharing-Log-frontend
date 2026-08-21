import {
  Mail,
  UserRound,
} from "lucide-react";

import InformationRow from "./InformationRow";
import NicknameEditor from "./NicknameEditor";

function AccountUserInformation({
  user,
  onUpdated,
}) {
  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <UserRound
          size={21}
          aria-hidden="true"
        />

        <h2 className="text-lg font-black">
          내 정보
        </h2>
      </div>

      <p className="mt-1 text-sm leading-6 text-[#8B8575]">
        닉네임을 변경하거나 로그인 계정 정보를
        확인할 수 있어요.
      </p>

      <div className="mt-5">
        {user ? (
          <>
            <NicknameEditor
              nickname={user.nickname}
              onUpdated={onUpdated}
            />

            <InformationRow
              icon={Mail}
              label="이메일"
              value={
                user.email ||
                "이메일 정보가 없어요"
              }
            />
          </>
        ) : (
          <p className="rounded-xl bg-[#F8F4EE] px-4 py-5 text-center text-sm font-semibold text-[#8B8575]">
            사용자 정보를 불러오지 못했어요.
          </p>
        )}
      </div>
    </section>
  );
}

export default AccountUserInformation;
