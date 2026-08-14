import { AVATAR_COLORS } from "../constants/member";

// 이름의 첫 글자를 프로필 아이콘에 표시합니다.
export function getInitial(displayName) {
  const trimmedName =
    displayName?.trim();

  if (!trimmedName) {
    return "?";
  }

  return Array.from(trimmedName)[0];
}

// membershipId를 기준으로 항상 같은 프로필 색상을 반환합니다.
export function getMemberColor(memberKey) {
  const safeKey =
    String(memberKey ?? "").trim();

  if (!safeKey) {
    return AVATAR_COLORS[0];
  }

  let hash = 0;

  for (
    let index = 0;
    index < safeKey.length;
    index += 1
  ) {
    hash =
      (hash * 31 +
        safeKey.charCodeAt(index)) |
      0;
  }

  const colorIndex =
    Math.abs(hash) %
    AVATAR_COLORS.length;

  return AVATAR_COLORS[colorIndex];
}

// 관리자를 먼저 보여주고 같은 역할에서는 이름순으로 정렬합니다.
export function sortMembers(members) {
  return [...members].sort(
    (firstMember, secondMember) => {
      const firstMemberIsOwner =
        firstMember.role === "OWNER";

      const secondMemberIsOwner =
        secondMember.role === "OWNER";

      if (
        firstMemberIsOwner !==
        secondMemberIsOwner
      ) {
        return firstMemberIsOwner
          ? -1
          : 1;
      }

      return (
        firstMember.displayName ?? ""
      ).localeCompare(
        secondMember.displayName ?? "",
        "ko",
      );
    },
  );
}