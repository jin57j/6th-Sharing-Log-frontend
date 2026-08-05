import { useState } from "react";
import { useNavigate } from "react-router";

import {
  getCsrfToken,
  updateNickname,
} from "../api/authApi";
import { getMyGroup } from "../api/groupApi";

const MAX_NICKNAME_LENGTH = 20;

export default function useProfileSetup() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const normalizedNickname = nickname.trim();

  const isNicknameValid =
    normalizedNickname.length >= 1 &&
    normalizedNickname.length <=
      MAX_NICKNAME_LENGTH;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isNicknameValid || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // 1. 닉네임 수정 요청에 필요한 CSRF 토큰을 받습니다.
      const csrf = await getCsrfToken();

      // 2. 사용자가 입력한 닉네임을 백엔드에 저장합니다.
      await updateNickname({
        nickname: normalizedNickname,
        csrf,
      });

      // 3. 사용자가 가입한 하우스를 조회합니다.
      const group = await getMyGroup();

      // 4. 하우스가 있으면 홈으로 이동합니다.
      if (group) {
        navigate("/home", {
          replace: true,
        });

        return;
      }

      // 5. 하우스가 없으면 하우스 선택 화면으로 이동합니다.
      navigate("/house-choice", {
        replace: true,
      });
    } catch (error) {
      // 로그인 세션이 만료된 경우
      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      setErrorMessage(
        error.message ??
          "처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    nickname,
    setNickname,
    errorMessage,
    isSubmitting,
    isNicknameValid,
    maxNicknameLength: MAX_NICKNAME_LENGTH,
    handleSubmit,
  };
}