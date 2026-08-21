import Logo from "../../common/Logo";

function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-center border-b border-[#1A1428]/10 bg-white px-5 lg:hidden">
      <Logo />
    </header>
  );
}

export default MobileHeader;
