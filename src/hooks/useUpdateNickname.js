import { useState } from "react";
import { useNavigate } from "react-router";

import {
  getCsrfToken,
  updateNickname,
} from "../api/authApi";

const MAX_NICKNAME_LENGTH = 20;

export default function useUpdateNickname({
  initialNickname,
  onSuccess,
}) {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(
    initialNickname ?? "",
  );

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const normalizedNickname = nickname.trim();

  const isNicknameValid =
    normalizedNickname.length >= 1 &&
    normalizedNickname.length <=
      MAX_NICKNAME_LENGTH;

  const hasNicknameChanged =
    normalizedNickname !==
    (initialNickname ?? "").trim();

  function handleNicknameChange(event) {
    setNickname(event.target.value);
    setErrorMessage("");
  }

  // 수정을 취소하면 입력값을 기존 닉네임으로 되돌립니다.
  function resetNickname() {
    setNickname(initialNickname ?? "");
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !isNicknameValid ||
      !hasNicknameChanged ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const csrf = await getCsrfToken();

      const updatedUser = await updateNickname({
        nickname: normalizedNickname,
        csrf,
      });

      setNickname(updatedUser.nickname);

      // 공통 프로필 정보를 변경합니다.
      onSuccess(updatedUser);
    } catch (error) {
      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      setErrorMessage(
        error.message ??
          "닉네임을 변경하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    nickname,
    isSaving,
    errorMessage,
    isNicknameValid,
    hasNicknameChanged,
    maxNicknameLength: MAX_NICKNAME_LENGTH,
    handleNicknameChange,
    resetNickname,
    handleSubmit,
  };
}