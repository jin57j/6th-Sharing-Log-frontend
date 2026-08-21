export default function SummaryCard({
  icon: Icon,
  label,
  count,
  colorClass,
}) {
  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-4 shadow-sm">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${colorClass}`}
      >
        <Icon size={18} aria-hidden="true" />
      </div>

      <p className="mt-3 text-xs font-bold text-[#8B8575]">{label}</p>

      <p className="mt-1 text-2xl font-black">
        {count}
        <span className="ml-1 text-sm text-[#8B8575]">건</span>
      </p>
    </section>
  );
}
