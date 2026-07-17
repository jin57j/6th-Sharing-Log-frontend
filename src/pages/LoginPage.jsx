import { useNavigate } from "react-router";

function LoginPage() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/house-choice");
  }

  return (
    <main>
      <h1>같이살기</h1>

      <h2>
        같이 살아도
        <br />
        할 일은 가볍게
      </h2>

      <p>공동생활의 모든 업무를 한 곳에서 관리해요.</p>

      <section>
        <h2>시작하기</h2>

        <button type="button" onClick={handleLogin}>
          Google 계정으로 계속하기
        </button>

        <p>
          계속하면 서비스 이용약관 및 개인정보 처리방침에
          동의하게 됩니다.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;