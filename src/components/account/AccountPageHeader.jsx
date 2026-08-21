import { Settings } from "lucide-react";

function AccountPageHeader() {
  return (
    <header>
      <p className="text-sm text-[#8B8575]">
        내 정보와 하우스 설정을 한곳에서 관리해요
      </p>

      <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
        <Settings
          size={27}
          aria-hidden="true"
        />
        설정
      </h1>
    </header>
  );
}

export default AccountPageHeader;
