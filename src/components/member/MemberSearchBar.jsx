import { Search, X } from "lucide-react";

export default function MemberSearchBar({
  searchKeyword,
  setSearchKeyword,
  isDisabled,
}) {
  return (
    <div className="relative mt-6">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8575]"
        aria-hidden="true"
      />

      <input
        type="search"
        value={searchKeyword}
        onChange={(event) => setSearchKeyword(event.target.value)}
        placeholder="멤버 닉네임 검색"
        aria-label="멤버 닉네임 검색"
        disabled={isDisabled}
        className="h-12 w-full rounded-xl border border-[#1A1428]/10 bg-white pl-11 pr-11 text-sm font-semibold text-[#1A1428] outline-none transition-colors placeholder:font-normal placeholder:text-[#8B8575] focus:border-[#E63946] disabled:cursor-not-allowed disabled:bg-[#EFEBE2] disabled:opacity-70"
      />

      {searchKeyword && (
        <button
          type="button"
          onClick={() => setSearchKeyword("")}
          aria-label="멤버 검색어 지우기"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#8B8575] transition-colors hover:bg-[#EFEBE2] hover:text-[#1A1428]"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}