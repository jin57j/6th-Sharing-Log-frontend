const ACTIVE_GROUP_ID_KEY =
  "sharing-log-active-group-id";

// 브라우저에 저장한 현재 하우스 ID를 가져옵니다.
export function getSavedActiveGroupId() {
  return window.localStorage.getItem(
    ACTIVE_GROUP_ID_KEY,
  );
}

// 사용자가 선택한 하우스 ID를 저장합니다.
export function saveActiveGroupId(
  groupPublicId,
) {
  if (!groupPublicId) {
    clearActiveGroupId();
    return;
  }

  window.localStorage.setItem(
    ACTIVE_GROUP_ID_KEY,
    groupPublicId,
  );
}

// 저장된 현재 하우스 ID를 제거합니다.
export function clearActiveGroupId() {
  window.localStorage.removeItem(
    ACTIVE_GROUP_ID_KEY,
  );
}

// 전체 하우스 목록에서 현재 사용할 하우스를 찾습니다.
export function resolveActiveGroup(groups) {
  if (
    !Array.isArray(groups) ||
    groups.length === 0
  ) {
    clearActiveGroupId();
    return null;
  }

  const savedGroupId =
    getSavedActiveGroupId();

  const savedGroup = groups.find(
    (group) =>
      group.groupPublicId === savedGroupId,
  );

  // 전에 선택한 하우스가 목록에 남아 있다면 사용합니다.
  if (savedGroup) {
    return savedGroup;
  }

  // 가입한 하우스가 한 개뿐이면 자동으로 선택합니다.
  if (groups.length === 1) {
    saveActiveGroupId(
      groups[0].groupPublicId,
    );

    return groups[0];
  }

  // 여러 하우스가 있지만 선택한 하우스가 없다면
  // 하우스 선택 화면에서 직접 선택해야 합니다.
  clearActiveGroupId();

  return null;
}