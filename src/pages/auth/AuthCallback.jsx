import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL에 담겨온 토큰 파라미터 확인 (백엔드가 'token' 또는 'accessToken'으로 보낸다고 가정)
    const params = new URLSearchParams(location.search);
    const token = params.get("token") || params.get("accessToken");

    if (token) {
      // 1. 토큰을 localStorage에 저장
      localStorage.setItem("accessToken", token);

      // 2. 원하는 페이지(/house-choice)로 이동
      navigate("/house-choice", { replace: true });
    } else {
      alert("로그인에 실패했습니다.");
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8F4EE] text-lg font-bold">
      로그인 처리 중입니다...
    </div>
  );
}

export default AuthCallback;
