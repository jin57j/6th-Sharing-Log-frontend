export default function CompletedScopeTabs({
  scope,
  onChange,
}) {
  return (
    <div className="mt-5 flex rounded-2xl bg-[#EFEBE2] p-1.5">
      <button
        type="button"
        onClick={() => onChange("mine")}
        className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
          scope === "mine"
            ? "bg-white text-[#E63946] shadow-sm"
            : "text-[#8B8575]"
        }`}
      >
        내 기록
      </button>
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
          scope === "all"
            ? "bg-white text-[#E63946] shadow-sm"
            : "text-[#8B8575]"
        }`}
      >
        전체 기록
      </button>
    </div>
  );
}
