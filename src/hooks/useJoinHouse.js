import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import { acceptInvitation } from "../api/invitationApi";
import {
  INVITE_CODE_LENGTH,
  INVITE_CODE_REGEX,
} from "../constants/invitation";

export default function useJoinHouse() {
  const navigate = useNavigate();

  const [typedCode, setTypedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const cleanCode = typedCode.trim();

  function handleInputChange(event) {
    setTypedCode(event.target.value);
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // 초대 코드가 영문, 숫자, -, _로 구성된 22자리인지 검사합니다.
    const isValidCode = INVITE_CODE_REGEX.test(cleanCode);

    if (!isValidCode) {
      setErrorMessage(
        `영문, 숫자, -, _로 이루어진 ${INVITE_CODE_LENGTH}자리 코드를 입력해 주세요.`
      );
      return;
    }

    try {
      setErrorMessage("");
      setIsJoining(true);

      // 1. 서버에서 CSRF 보안 토큰을 가져옵니다.
      const csrf = await getCsrfToken();

      // 2. 초대 코드로 하우스 참가를 요청합니다.
      const joinedGroup = await acceptInvitation({
        code: cleanCode,
        csrf,
      });

      // 3. 참가한 하우스의 홈 화면으로 이동합니다.
      navigate("/home", {
        replace: true,
        state: {
          groupId: joinedGroup.groupId,
          houseName: joinedGroup.groupName,
          role: joinedGroup.role,
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "하우스 참가에 실패했습니다."
      );
    } finally {
      setIsJoining(false);
    }
  }

  return {
    typedCode,
    cleanCode,
    errorMessage,
    isJoining,
    handleInputChange,
    handleSubmit,
    navigate,
  };
}