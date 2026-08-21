import { RotateCcw } from "lucide-react";

function RotationPageHeader({ houseName }) {
  return (
    <header>
      <p className="text-sm text-[#8B8575]">{houseName}의 당번을 한눈에</p>
      <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
        <RotateCcw size={28} aria-hidden="true" />
        업무 로테이션
      </h1>
    </header>
  );
}

export default RotationPageHeader;
