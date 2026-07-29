// 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 반환해주는 함수

export function getToday() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}