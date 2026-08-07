import { useState } from "react";
import {
  Plus,
  Trash2,
} from "lucide-react";

function SpaceForm({
  spaces,
  deletingSpaceId,
  onAddSpace,
  onDeleteSpace,
}) {
  const [
    newSpaceName,
    setNewSpaceName,
  ] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const name =
      newSpaceName.trim();

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
            예약 공간 관리
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#8B8575]">
            예약이 필요한 공용공간을
            추가하거나 삭제할 수 있어요.
          </p>
        </div>
      </header>

      {/* 새로운 공간 추가 */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <label
          htmlFor="new-space"
          className="sr-only"
        >
          공간 이름
        </label>

        <input
          id="new-space"
          type="text"
          value={newSpaceName}
          onChange={(event) =>
            setNewSpaceName(
              event.target.value,
            )
          }
          placeholder="예: 옥상 테라스"
          className="min-w-0 flex-1 rounded-xl border border-[#1A1428]/10 bg-[#EFEBE2]/35 px-4 py-3 text-sm text-[#1A1428] outline-none transition placeholder:text-[#8B8575] focus:border-[#E63946]/40 focus:ring-2 focus:ring-[#E63946]/15"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1A1428]/10 bg-white px-5 py-3 text-sm font-bold text-[#1A1428] transition hover:bg-[#EFEBE2] active:scale-[0.98]"
        >
          <Plus
            size={16}
            aria-hidden="true"
          />
          공간 추가
        </button>
      </form>

      {/* 현재 등록된 공간 목록 */}
      <div className="mt-5 border-t border-[#1A1428]/10 pt-5">
        <h3 className="text-sm font-black text-[#1A1428]">
          등록된 공간
        </h3>

        {spaces.length === 0 ? (
          <p className="mt-3 rounded-xl bg-[#F8F4EE] px-4 py-4 text-center text-sm font-semibold text-[#8B8575]">
            등록된 공간이 없습니다.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {spaces.map((space) => {
              const isDeleting =
                String(
                  deletingSpaceId,
                ) ===
                String(space.spaceId);

              return (
                <li
                  key={space.spaceId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#1A1428]/10 px-4 py-3"
                >
                  <span className="min-w-0 break-words text-sm font-bold text-[#1A1428]">
                    {space.name}
                  </span>

                  <button
                    type="button"
                    disabled={Boolean(
                      deletingSpaceId,
                    )}
                    onClick={() =>
                      onDeleteSpace(
                        space,
                      )
                    }
                    className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#E63946] transition hover:bg-[#E63946]/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2
                      size={15}
                      aria-hidden="true"
                    />

                    {isDeleting
                      ? "삭제 중..."
                      : "삭제"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default SpaceForm;