import { useState } from "react";
import { Plus } from "lucide-react";

function SpaceForm({ onAddSpace }) {
  const [newSpaceName, setNewSpaceName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const name = newSpaceName.trim();

    if (!name) {
      onAddSpace("");
      return;
    }

    onAddSpace(name);
    setNewSpaceName("");
  }

  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-5">
      <header className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#06D6A0]/15 text-[#087F67]"
          aria-hidden="true"
        >
          <Plus size={19} />
        </span>

        <div>
          <h2 className="font-display text-base font-black text-[#1A1428]">
            새로운 공간 추가
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#8B8575]">
            예약이 필요한 공용공간을 추가할 수 있어요.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="new-space" className="sr-only">
          공간 이름
        </label>

        <input
          id="new-space"
          type="text"
          value={newSpaceName}
          onChange={(event) =>
            setNewSpaceName(event.target.value)
          }
          placeholder="예: 옥상 테라스"
          className="min-w-0 flex-1 rounded-xl border border-[#1A1428]/10 bg-[#EFEBE2]/35 px-4 py-3 text-sm text-[#1A1428] outline-none transition placeholder:text-[#8B8575] focus:border-[#E63946]/40 focus:ring-2 focus:ring-[#E63946]/15"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1A1428]/10 bg-white px-5 py-3 text-sm font-bold text-[#1A1428] transition hover:bg-[#EFEBE2] active:scale-[0.98]"
        >
          <Plus size={16} aria-hidden="true" />
          공간 추가
        </button>
      </form>
    </section>
  );
}

export default SpaceForm;