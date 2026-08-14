import { useState } from "react";
import {
  House,
  MapPin,
  Pencil,
} from "lucide-react";

import useUpdateHouse from "../../hooks/useUpdateHouse";

// 평소에 하우스 정보를 보여주는 한 줄입니다.
function HouseInformationRow({
  icon: Icon,
  label,
  value,
  onEdit,
  disabled,
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#1A1428]/10 py-4">
      <span className="mt-0.5 rounded-lg bg-[#F8F4EE] p-2 text-[#8B8575]">
        <Icon
          size={18}
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#8B8575]">
          {label}
        </p>

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
        <Pencil
          size={17}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

function HouseInformationEditor({
  house,
  onUpdated,
}) {
  // null: 조회 상태
  // name: 하우스 이름 수정 상태
  // address: 주소 수정 상태
  const [editingField, setEditingField] =
    useState(null);

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

    // 저장 성공 후 공통 하우스 정보를 갱신하고
    // 다시 조회 화면으로 돌아갑니다.
    onSuccess: (updatedGroup) => {
      onUpdated(updatedGroup);
      setEditingField(null);
    },
  });

  // 원하는 항목의 수정 화면을 엽니다.
  function startEditing(field) {
    resetHouseInformation();
    setEditingField(field);
  }

  // 변경 내용을 취소하고 조회 화면으로 돌아갑니다.
  function cancelEditing() {
    resetHouseInformation();
    setEditingField(null);
  }

  return (
    <div>
      {/* 하우스 이름 */}
      {editingField === "name" ? (
        <form
          onSubmit={handleSubmit}
          className="border-b border-[#1A1428]/10 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-[#E63946]/10 p-2 text-[#E63946]">
              <House
                size={18}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="account-house-name"
                className="text-xs font-semibold text-[#8B8575]"
              >
                하우스 이름
              </label>

              <input
                id="account-house-name"
                type="text"
                value={houseName}
                onChange={
                  handleHouseNameChange
                }
                maxLength={
                  maxHouseNameLength
                }
                disabled={isSaving}
                autoFocus
                placeholder="하우스 이름을 입력해 주세요"
                className="mt-2 w-full rounded-xl border border-[#E63946]/30 bg-[#F8F4EE]/60 px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#8B8575]/60 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-[#8B8575]">
                  1자 이상 50자 이하
                </p>

                <span className="shrink-0 text-xs font-semibold text-[#8B8575]">
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

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg bg-[#E63946]/5 px-3 py-2 text-xs font-semibold text-[#E63946]"
                >
                  {errorMessage}
                </p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-[#1A1428]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#8B8575] transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={
                    !isHouseNameValid ||
                    !hasHouseInformationChanged ||
                    isSaving
                  }
                  className="flex items-center justify-center rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {isSaving
                    ? "저장 중..."
                    : "저장"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <HouseInformationRow
          icon={House}
          label="하우스 이름"
          value={house.groupName}
          disabled={editingField !== null}
          onEdit={() =>
            startEditing("name")
          }
        />
      )}

      {/* 하우스 주소 */}
      {editingField === "address" ? (
        <form
          onSubmit={handleSubmit}
          className="border-b border-[#1A1428]/10 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-[#E63946]/10 p-2 text-[#E63946]">
              <MapPin
                size={18}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="account-house-address"
                className="text-xs font-semibold text-[#8B8575]"
              >
                주소
              </label>

              <input
                id="account-house-address"
                type="text"
                value={houseAddress}
                onChange={
                  handleHouseAddressChange
                }
                maxLength={
                  maxAddressLength
                }
                disabled={isSaving}
                autoFocus
                placeholder="하우스 주소를 입력해 주세요"
                className="mt-2 w-full rounded-xl border border-[#E63946]/30 bg-[#F8F4EE]/60 px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#8B8575]/60 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-[#8B8575]">
                  비워두면 등록된 주소가 삭제돼요.
                </p>

                <span className="shrink-0 text-xs font-semibold text-[#8B8575]">
                  {houseAddress.length}/
                  {maxAddressLength}
                </span>
              </div>

              {!isAddressValid && (
                <p className="mt-2 text-xs font-semibold text-[#E63946]">
                  주소는 255자 이하로 입력해 주세요.
                </p>
              )}

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg bg-[#E63946]/5 px-3 py-2 text-xs font-semibold text-[#E63946]"
                >
                  {errorMessage}
                </p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-[#1A1428]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#8B8575] transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={
                    !isAddressValid ||
                    !hasHouseInformationChanged ||
                    isSaving
                  }
                  className="flex items-center justify-center rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {isSaving
                    ? "저장 중..."
                    : "저장"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <HouseInformationRow
          icon={MapPin}
          label="주소"
          value={
            house.groupAddress ||
            "등록된 주소가 없어요"
          }
          disabled={editingField !== null}
          onEdit={() =>
            startEditing("address")
          }
        />
      )}
    </div>
  );
}

export default HouseInformationEditor;