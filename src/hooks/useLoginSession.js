import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getCurrentUser } from "../api/authApi";
import { buildBackendUrl } from "../api/apiConfig";
import { getMyGroup } from "../api/groupApi";

export default function useLoginSession() {
  const navigate = useNavigate();

  // URL에 ?error=true가 있다면 OAuth 로그인 실패로 판단합니다.
  const loginFailed =
    new URLSearchParams(window.location.search).get("error") === "true";

  // 로그인 상태를 확인하고 있는지 저장합니다.
  const [isCheckingSession, setIsCheckingSession] = useState(!loginFailed);

  // 로그인 후 사용자·하우스 정보를 확인하다가 발생한 오류입니다.
  const [sessionError, setSessionError] = useState("");

  // OAuth 로그인 후 백엔드가 localhost:5173/로 돌려보내면
  // 사용자 정보와 하우스 정보를 확인해서 다음 화면을 결정합니다.
  useEffect(() => {
    // OAuth 로그인에 실패해서 돌아온 경우에는
    // 사용자 정보를 조회하지 않습니다.
    if (loginFailed) {
      return undefined;
    }

    let cancelled = false;

    async function checkLoginSession() {
      setIsCheckingSession(true);
      setSessionError("");

      try {
        // 1. 현재 로그인한 사용자의 정보를 가져옵니다.
        const user = await getCurrentUser();

        // 컴포넌트가 사라진 뒤에는 아래 작업을 진행하지 않습니다.
        if (cancelled) {
          return;
        }

        console.log("로그인한 사용자:", user);

        // 2. 닉네임이 없으면 사용자 정보 입력 화면으로 이동합니다.
        //
        // nickname이 null이거나 빈 문자열이거나
        // 공백만 입력되어 있는 경우를 모두 검사합니다.
        if (!user.nickname?.trim()) {
          navigate("/profile-setup", {
            replace: true,
          });
          return;
        }

        // 3. 닉네임이 있다면 현재 가입한 하우스를 조회합니다.
        const group = await getMyGroup();

        if (cancelled) {
          return;
        }

        console.log("가입한 하우스:", group);

        // 4. 가입한 하우스가 있으면 홈 화면으로 이동합니다.
        if (group) {
          navigate("/home", {
            replace: true,
          });
          return;
        }

        // 5. 가입한 하우스가 없으면 하우스 선택 화면으로 이동합니다.
        //
        // getMyGroup()은 백엔드가 404를 반환하면
        // null을 반환하도록 작성되어 있습니다.
        navigate("/house-choice", {
          replace: true,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        // 처음 방문한 비로그인 사용자라면
        // /api/auth/me가 401을 반환하는 것이 정상입니다.
        if (error.status === 401) {
          console.log("현재 로그인 세션이 없습니다.");
          return;
        }

        // 하우스 조회 500 등 예상하지 못한 오류는
        // 로그인 화면에 오류 메시지로 표시합니다.
        console.error(
          "로그인 후 이동할 화면을 결정하지 못했습니다.",
          error,
        );

        setSessionError(
          error.message ?? "사용자 정보를 확인하지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    checkLoginSession();

    // 다른 화면으로 이동해서 LoginPage가 사라졌다면
    // 진행 중인 결과를 더 이상 화면에 반영하지 않습니다.
    return () => {
      cancelled = true;
    };
  }, [loginFailed, navigate]);

  // OAuth 로그인은 fetch 요청이 아니라
  // 백엔드 로그인 주소로 브라우저 전체를 이동해야 합니다.
  function handleSocialLogin(provider) {
    window.location.href = buildBackendUrl(
      `/oauth2/authorization/${provider}`,
    );
  }

  return {
    loginFailed,
    isCheckingSession,
    sessionError,
    handleSocialLogin,
  };
}