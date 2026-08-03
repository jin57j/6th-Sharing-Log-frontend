// 초대 코드 자릿수 제약 조건
export const INVITE_CODE_LENGTH = 22;

// 영문, 숫자, -, _로 구성된 22자리 초대 코드 검증 정규식
export const INVITE_CODE_REGEX = new RegExp(
  `^[A-Za-z0-9_-]{${INVITE_CODE_LENGTH}}$`
);