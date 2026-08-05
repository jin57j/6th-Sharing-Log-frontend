// 조회 전용 정보 한 줄을 표시하는 컴포넌트
export default function InformationRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#1A1428]/10 py-4 last:border-b-0">
      <span className="mt-0.5 rounded-lg bg-[#F8F4EE] p-2 text-[#8B8575]">
        <Icon size={18} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#8B8575]">{label}</p>

        <p className="mt-1 break-words text-sm font-bold text-[#1A1428]">
          {value}
        </p>
      </div>
    </div>
  );
}