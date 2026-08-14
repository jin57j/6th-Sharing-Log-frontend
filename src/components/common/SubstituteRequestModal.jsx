import { useEffect, useState } from "react";
import { LuHandshake, LuSend, LuX } from "react-icons/lu";

function SubstituteRequestModal({ task, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!reason.trim()) {
      setErrorMessage("대타가 필요한 이유를 입력해 주세요.");
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await onSubmit(reason.trim());
      onClose();
    } catch (error) {
      setErrorMessage(error.message ?? "대타 요청을 보내지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="substitute-request-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-[560px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <header className="relative bg-[#CD4A4F] px-7 py-10 text-white sm:px-12">
          <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="대타 요청 창 닫기" className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 transition hover:bg-white/25 disabled:cursor-not-allowed">
            <LuX className="h-7 w-7" />
          </button>
          <p className="mb-3 flex items-center gap-2 text-lg font-bold"><LuHandshake className="h-6 w-6" />당번 대타 요청</p>
          <h2 id="substitute-request-title" className="text-4xl font-black">{task.choreName}</h2>
        </header>
        <div className="p-7 sm:p-12">
          <p className="mb-10 text-lg leading-8 text-[#77736A]">멤버 모두에게 요청을 보내요. 가능한 사람이 수락하면 당번에 반영됩니다.</p>
          <label htmlFor="substitute-reason" className="mb-3 block text-xl font-black text-[#1A1428]">대타가 필요한 이유</label>
          <textarea id="substitute-reason" value={reason} onChange={(event) => { setReason(event.target.value); setErrorMessage(""); }} placeholder="예: 갑자기 야근이 생겼어요" maxLength={500} disabled={isSubmitting} className="min-h-40 w-full resize-none rounded-[28px] border border-[#D9D6D0] bg-[#FCFBF9] p-5 text-lg text-[#1A1428] outline-none transition placeholder:text-[#9A978F] focus:border-[#CD4A4F] focus:ring-2 focus:ring-[#CD4A4F]/20 disabled:bg-gray-100" />
          {errorMessage && <p role="alert" className="mt-2 text-sm font-semibold text-[#CD4A4F]">{errorMessage}</p>}
          <button type="submit" disabled={isSubmitting} className="mt-8 flex w-full items-center justify-center gap-3 rounded-[28px] bg-[#CD4A4F] py-5 text-xl font-black text-white transition hover:bg-[#B63D42] disabled:cursor-not-allowed disabled:opacity-60">
            <LuSend className="h-6 w-6" />{isSubmitting ? "요청 보내는 중..." : "요청 보내기"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubstituteRequestModal;
