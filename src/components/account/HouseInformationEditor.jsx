import { useState } from "react";
import {
  House,
  MapPin,
  Pencil,
  Save,
} from "lucide-react";

import useUpdateHouse from "../../hooks/useUpdateHouse";
import InformationRow from "./InformationRow";

function HouseInformationEditor({
  house,
  onUpdated,
}) {
  const [isEditing, setIsEditing] =
    useState(false);

  const {
    houseName,
    houseAddress,
    isSaving,
    errorMessage,
    isHouseNameValid,
    isAddressValid,
    hasHouseInformationChanged,
    maxHouseNameLength,
    maxAddressLength,
    handleHouseNameChange,
    handleHouseAddressChange,
    resetHouseInformation,
    handleSubmit,
  } = useUpdateHouse({
    house,
    onSuccess: (updatedGroup) => {
      onUpdated(updatedGroup);
      setIsEditing(false);
    },
  });

  if (!isEditing) {
    return (
      <div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              resetHouseInformation();
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-[#8B8575] transition hover:bg-[#EFEBE2] hover:text-[#E63946]"
          >
            <Pencil
              size={16}
              aria-hidden="true"
            />
            정보 수정
          </button>
        </div>

        <InformationRow
          icon={House}
          label="하우스 이름"
          value={house.groupName}
        />

        <InformationRow
          icon={MapPin}
          label="주소"
          value={
            house.groupAddress ||
            "등록된 주소가 없어요"
          }
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl bg-[#F8F4EE]/70 p-4"
    >
      <div>
        <label
          htmlFor="account-house-name"
          className="flex items-center gap-2 text-sm font-bold text-[#1A1428]"
        >
          <House
            size={17}
            aria-hidden="true"
          />
          하우스 이름
        </label>

        <input
          id="account-house-name"
          type="text"
          value={houseName}
          onChange={handleHouseNameChange}
          maxLength={maxHouseNameLength}
          disabled={isSaving}
          autoFocus
          placeholder="하우스 이름을 입력해 주세요"
          className="mt-2 w-full rounded-xl border border-[#1A1428]/10 bg-white px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#8B8575]/60 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/15 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <div className="mt-2 flex justify-between gap-3 text-xs text-[#8B8575]">
          <span>1자 이상 50자 이하</span>

          <span>
            {houseName.length}/
            {maxHouseNameLength}
          </span>
        </div>

        {!isHouseNameValid &&
          houseName.length > 0 && (
            <p className="mt-2 text-xs font-semibold text-[#E63946]">
              하우스 이름은 1자 이상 50자
              이하로 입력해 주세요.
            </p>
          )}
      </div>

      <div className="mt-5">
        <label
          htmlFor="account-house-address"
          className="flex items-center gap-2 text-sm font-bold text-[#1A1428]"
        >
          <MapPin
            size={17}
            aria-hidden="true"
          />
          주소
        </label>

        <input
          id="account-house-address"
          type="text"
          value={houseAddress}
          onChange={
            handleHouseAddressChange
          }
          maxLength={maxAddressLength}
          disabled={isSaving}
          placeholder="하우스 주소를 입력해 주세요"
          className="mt-2 w-full rounded-xl border border-[#1A1428]/10 bg-white px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#8B8575]/60 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/15 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <div className="mt-2 flex justify-between gap-3 text-xs text-[#8B8575]">
          <span>
            비워두면 등록된 주소가
            삭제됩니다.
          </span>

          <span>
            {houseAddress.length}/
            {maxAddressLength}
          </span>
        </div>

        {!isAddressValid && (
          <p className="mt-2 text-xs font-semibold text-[#E63946]">
            주소는 255자 이하로 입력해
            주세요.
          </p>
        )}
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            resetHouseInformation();
            setIsEditing(false);
          }}
          className="rounded-xl border border-[#1A1428]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#8B8575] transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>

        <button
          type="submit"
          disabled={
            !isHouseNameValid ||
            !isAddressValid ||
            !hasHouseInformationChanged ||
            isSaving
          }
          className="flex items-center gap-2 rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save
            size={16}
            aria-hidden="true"
          />

          {isSaving
            ? "저장 중..."
            : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}

export default HouseInformationEditor;
