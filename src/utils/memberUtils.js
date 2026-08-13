// 닉네임의 첫 글자를 프로필 아이콘에 표시합니다.
export function getInitial(displayName) {
  const trimmedName = displayName?.trim();

  if (!trimmedName) {
    return "?";
  }

  return Array.from(trimmedName)[0];
}

// 관리자 멤버를 목록 위쪽에 먼저 표시합니다.
export function sortMembers(members) {
  return [...members].sort((firstMember, secondMember) => {
    const firstMemberIsOwner = firstMember.role === "OWNER";
    const secondMemberIsOwner = secondMember.role === "OWNER";

    if (firstMemberIsOwner !== secondMemberIsOwner) {
      return firstMemberIsOwner ? -1 : 1;
    }

    return (firstMember.displayName ?? "").localeCompare(
      secondMember.displayName ?? "",
      "ko",
    );
  });
}