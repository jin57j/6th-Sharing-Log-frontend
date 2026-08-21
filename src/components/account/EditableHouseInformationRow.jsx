import { Pencil } from "lucide-react";

function EditableHouseInformationRow({
  icon: Icon,
  label,
  value,
  onEdit,
  disabled,
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#1A1428]/10 py-4">
      <span className="mt-0.5 rounded-lg bg-[#F8F4EE] p-2 text-[#8B8575]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#8B8575]">{label}</p>
        <p className="mt-1 break-words text-sm font-bold text-[#1A1428]">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        aria-label={`${label} 수정`}
        className="rounded-lg p-2 text-[#8B8575] transition hover:bg-[#EFEBE2] hover:text-[#E63946] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Pencil size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

export default EditableHouseInformationRow;
