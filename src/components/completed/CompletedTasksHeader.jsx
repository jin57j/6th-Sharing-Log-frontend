import { History } from "lucide-react";

export default function CompletedTasksHeader({
  houseName,
}) {
  return (
    <header>
      <p className="text-sm text-[#8B8575]">
        {houseName}의 지난 업무 기록
      </p>
      <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
        <History
          size={28}
          aria-hidden="true"
        />
        완료 업무
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#8B8575]">
        완료한 업무와 마감까지 완료하지 못한 업무를 함께 확인할 수 있어요.
      </p>
    </header>
  );
}
