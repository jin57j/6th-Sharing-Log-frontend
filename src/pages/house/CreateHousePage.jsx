import { useState } from "react";
import { useNavigate } from "react-router";

import OnboardingShell from "../../components/OnboardingShell";

function CreateHousePage() {
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const csrf = await fetch(`/api/auth/csrf`, {
      credentials: "include",
    }).then((response) => response.json());

    const headers = {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    };

    const group = await fetch(`/api/groups`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        name: houseName.trim(),
      }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("하우스 생성에 실패했습니다.");
      return response.json();
    });

    const invitation = await fetch(`/api/groups/${group.groupId}/invitations`, {
      method: "POST",
      credentials: "include",
      headers: {
        [csrf.headerName]: csrf.token,
      },
    }).then(async (response) => {
      if (!response.ok) throw new Error("초대 링크 생성에 실패했습니다.");
      return response.json();
    });

    navigate("/invite-house", {
      state: {
        houseName: group.name,
        groupId: group.groupId,
        inviteCode: invitation.code,
        inviteUrl: invitation.inviteUrl,
        expiresAt: invitation.expiresAt,
      },
    });
  }

  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm">
        <header className="mb-6 text-center">
          <div
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E63946]/10 text-2xl"
            aria-hidden="true"
          >
            ✨
          </div>

          <h1 className="font-display text-2xl font-black tracking-[-0.03em]">
            새 하우스 만들기
          </h1>

          <p className="mt-1.5 text-sm text-[#8B8575]">
            하우스 정보를 입력하면 초대코드가 생성돼요
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[28px] border border-[#1A1428]/10 bg-white p-7 shadow-xl"
        >
          <div>
            <label
              htmlFor="house-name"
              className="mb-2 block text-sm font-bold"
            >
              하우스 이름 <span className="text-[#E63946]">*</span>
            </label>

            <input
              id="house-name"
              type="text"
              value={houseName}
              onChange={(event) => setHouseName(event.target.value)}
              placeholder="예: 강남 쉐어하우스"
              maxLength={50}
              required
              className="w-full rounded-xl border border-[#1A1428]/10 bg-[#EFEBE2]/40 px-4 py-3 text-sm outline-none transition placeholder:text-[#8B8575]/70 focus:border-[#E63946]/40 focus:ring-2 focus:ring-[#E63946]/20"
            />
          </div>

          <div>
            <label
              htmlFor="house-address"
              className="mb-2 block text-sm font-bold"
            >
              주소{" "}
              <span className="text-xs font-normal text-[#8B8575]">(선택)</span>
            </label>

            <input
              id="house-address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="예: 서울시 강남구 역삼동"
              className="w-full rounded-xl border border-[#1A1428]/10 bg-[#EFEBE2]/40 px-4 py-3 text-sm outline-none transition placeholder:text-[#8B8575]/70 focus:border-[#E63946]/40 focus:ring-2 focus:ring-[#E63946]/20"
            />
          </div>

          <button
            type="submit"
            disabled={!houseName.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E63946] py-3.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            하우스 만들기
            <span aria-hidden="true">›</span>
          </button>
        </form>
      </div>
    </OnboardingShell>
  );
}

export default CreateHousePage;
