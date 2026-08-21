import { NavLink } from "react-router";

function SidebarMenuItem({
  to,
  label,
  icon: Icon,
  badge,
  primary = false,
  onNavigate,
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => {
        const baseStyle =
          "flex w-full items-center gap-3 rounded-xl text-sm transition-colors";
        const typeStyle = primary
          ? "px-3 py-3 font-bold"
          : "px-3 py-2.5 font-semibold";
        const activeStyle = isActive
          ? primary
            ? "bg-[#E63946] text-white shadow-sm"
            : "bg-[#FFB703]/25 text-[#1A1428]"
          : "text-[#8B8575] hover:bg-[#EFEBE2] hover:text-[#1A1428]";

        return `${baseStyle} ${typeStyle} ${activeStyle}`;
      }}
    >
      <Icon size={primary ? 18 : 17} aria-hidden="true" />
      <span>{label}</span>
      {badge > 0 && (
        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#E63946] px-1 text-[10px] text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default SidebarMenuItem;
