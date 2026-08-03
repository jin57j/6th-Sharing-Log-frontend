// 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 반환해주는 함수
export function getToday() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

// 남은 시간을 "6일 3시간" 형태의 글자로 변환
export function formatRemainingTime(dueAt) {
  const difference = new Date(dueAt).getTime() - Date.now();

  if (difference <= 0) {
    return "마감됨";
  }

  const totalHours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0) return `${hours}시간`;
  if (hours === 0) return `${days}일`;

  return `${days}일 ${hours}시간`;
}

// ISO 날짜를 읽기 쉬운 날짜 포맷으로 변환
export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

// 오늘 날짜를 'YYYY년 M월 D일 · O요일' 형태의 한글 포맷 문자열로 반환
export const getFormattedToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[now.getDay()];

  return `${year}년 ${month}월 ${date}일 · ${dayName}요일`;
};