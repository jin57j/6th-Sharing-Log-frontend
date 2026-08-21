import { getHouseEmoji } from "../../utils/houseIcon";

function HouseSelectionItem({ group, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(group)}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#1A1428]/10 bg-white p-4 text-left shadow-sm transition hover:border-[#E63946]/40 hover:bg-[#E63946]/5 active:scale-[0.98]"
    >
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EFEBE2] text-xl"
        aria-hidden="true"
      >
        {getHouseEmoji(group.groupPublicId)}
      </span>

      <span className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-black text-[#1A1428]">
          {group.groupName}
        </strong>
        <span className="mt-1 block truncate text-xs text-[#8B8575]">
          {group.groupAddress || "등록된 주소 없음"}
        </span>
      </span>

      <span className="rounded-full bg-[#FFB703]/20 px-2.5 py-1 text-[10px] font-bold text-[#1A1428]">
        {group.role === "OWNER" ? "관리자" : "멤버"}
      </span>
      <span className="text-lg text-[#E63946]" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

export default HouseSelectionItem;
