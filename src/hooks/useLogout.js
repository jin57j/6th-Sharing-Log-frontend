import { useState } from 'react';
import { useNavigate } from "react-router";

import { logout } from "../api/authApi";

export function useLogout() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (onSuccess) => {
    // 이미 로그아웃 중이면 중복 실행 방지
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // 백엔드 세션 종료 요청
      await logout();

      // 성공 시 추가 작업 수행 (예: 모바일 메뉴 닫기)
      if (onSuccess) {
        onSuccess();
      }

      // 로그인 화면으로 이동 (뒤로 가기 방지)
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
      window.alert('로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}