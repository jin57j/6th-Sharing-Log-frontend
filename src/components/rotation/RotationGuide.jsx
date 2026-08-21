import { Sparkles } from "lucide-react";

function RotationGuide() {
  return (
    <div className="mt-5 rounded-2xl border border-[#06D6A0]/30 bg-[#06D6A0]/10 p-4">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Sparkles size={16} className="text-[#06A77D]" aria-hidden="true" />
        업무를 누르면 담당자 일정을 달력으로 확인할 수 있어요.
      </p>
      <p className="mt-1 pl-6 text-xs leading-5 text-[#8B8575]">
        로테이션은 참여 멤버 순서에 따라 자동으로 배정돼요.
      </p>
    </div>
  );
}

export default RotationGuide;
