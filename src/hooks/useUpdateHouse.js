import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import { updateGroup } from "../api/groupApi";

const MAX_HOUSE_NAME_LENGTH = 50;
const MAX_ADDRESS_LENGTH = 255;

export default function useUpdateHouse({
  house,
  onSuccess,
}) {
  const navigate = useNavigate();

  const [houseName, setHouseName] =
    useState(house.groupName ?? "");

  const [houseAddress, setHouseAddress] =
    useState(house.groupAddress ?? "");

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const normalizedHouseName =
    houseName.trim();

  const normalizedHouseAddress =
    houseAddress.trim();

  const initialHouseName =
    (house.groupName ?? "").trim();

  const initialHouseAddress =
    (house.groupAddress ?? "").trim();

  const isHouseNameValid =
    normalizedHouseName.length >= 1 &&
    normalizedHouseName.length <=
      MAX_HOUSE_NAME_LENGTH;

  const isAddressValid =
    normalizedHouseAddress.length <=
    MAX_ADDRESS_LENGTH;

  const hasHouseNameChanged =
    normalizedHouseName !==
    initialHouseName;

  const hasAddressChanged =
    normalizedHouseAddress !==
    initialHouseAddress;

  const hasHouseInformationChanged =
    hasHouseNameChanged ||
    hasAddressChanged;

  function handleHouseNameChange(event) {
    setHouseName(event.target.value);
    setErrorMessage("");
  }

  function handleHouseAddressChange(event) {
    setHouseAddress(event.target.value);
    setErrorMessage("");
  }

  function resetHouseInformation() {
    setHouseName(house.groupName ?? "");
    setHouseAddress(
      house.groupAddress ?? "",
    );
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !isHouseNameValid ||
      !isAddressValid ||
      !hasHouseInformationChanged ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const csrf = await getCsrfToken();

      // 실제로 변경된 값만 백엔드에 전달합니다.
      const changes = {};

      if (hasHouseNameChanged) {
        changes.name =
          normalizedHouseName;
      }

      if (hasAddressChanged) {
        changes.address =
          normalizedHouseAddress;
      }

      const updatedGroup =
        await updateGroup({
          groupPublicId:
            house.groupPublicId,
          ...changes,
          csrf,
        });

      setHouseName(updatedGroup.name);
      setHouseAddress(
        updatedGroup.address ?? "",
      );

      onSuccess(updatedGroup);
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      if (error.status === 403) {
        setErrorMessage(
          "하우스 관리자만 정보를 수정할 수 있습니다.",
        );

        return;
      }

      if (error.status === 404) {
        setErrorMessage(
          "수정할 하우스를 찾을 수 없습니다.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "하우스 정보를 수정하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    houseName,
    houseAddress,
    isSaving,
    errorMessage,

    isHouseNameValid,
    isAddressValid,
    hasHouseInformationChanged,

    maxHouseNameLength:
      MAX_HOUSE_NAME_LENGTH,

    maxAddressLength:
      MAX_ADDRESS_LENGTH,

    handleHouseNameChange,
    handleHouseAddressChange,
    resetHouseInformation,
    handleSubmit,
  };
}
