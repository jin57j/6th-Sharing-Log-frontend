// 22자리 초대코드를 보기 편하게 4자리씩 띄어쓰기해주는 함수
export function makeReadableCode(code) {
  return code.match(/.{1,4}/g)?.join(" ") ?? code;
}

export function formatExpiry(value) {
  const date = new Date(value);

  // 날짜값이 이상하면 "24시간 후"라는 안전장치 문구를 보여줌
  if (Number.isNaN(date.getTime())) {
    return "24시간 후";
  }

  // 올바른 날짜값이면 한글이 포함된 포맷으로 예쁘게 바꿔줌
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}