// 같이살기 로고 컴포넌트
export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-[#E63946] text-lg shadow-sm">
        🏠
      </span>
      <span className="font-display text-lg font-black tracking-[-0.02em] text-[#1A1428]">
        같이살기
      </span>
    </div>
  );
}