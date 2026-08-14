import { Settings2 } from "lucide-react";

import InvitationReissueControl from "./InvitationReissueControl";

function OtherSettingsSection({
  house,
}) {
  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Settings2
          size={21}
          aria-hidden="true"
        />

        <h2 className="text-lg font-black">
          기타 설정
        </h2>
      </div>

      <p className="mt-1 text-sm leading-6 text-[#8B8575]">
        관리자 전용 기능을 제공해요.
      </p>

      <div className="mt-6 border-t border-[#1A1428]/10 pt-5">
        <InvitationReissueControl
          house={house}
        />
      </div>
    </section>
  );
}

export default OtherSettingsSection;