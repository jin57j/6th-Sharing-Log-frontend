import SidebarPanel from "./SidebarPanel";

function MobileSidebarOverlay({ onClose, ...panelProps }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        aria-label="메뉴 닫기"
        className="absolute inset-0 bg-[#1A1428]/25"
      />
      <SidebarPanel mobile onClose={onClose} {...panelProps} />
    </div>
  );
}

export default MobileSidebarOverlay;
