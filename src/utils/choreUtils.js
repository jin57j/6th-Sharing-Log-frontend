export const getChoreIcon = (choreName = "") => {
  if (choreName.includes("쓰레기") || choreName.includes("분리수거")) {
    return "🗑️";
  }

  if (
    choreName.includes("주방") ||
    choreName.includes("설거지") ||
    choreName.includes("식기")
  ) {
    return "🍽️";
  }

  if (choreName.includes("화장실") || choreName.includes("욕실")) return "🚽";
  if (choreName.includes("빨래") || choreName.includes("세탁") || choreName.includes("건조")) return "🧺";
  if (choreName.includes("청소") || choreName.includes("바닥") || choreName.includes("거실")) return "🧹";
  if (choreName.includes("냉장고") || choreName.includes("음식") || choreName.includes("식재료")) return "🧊";
  if (choreName.includes("장보기") || choreName.includes("구매") || choreName.includes("소모품")) return "🛒";
  if (choreName.includes("정리") || choreName.includes("수납")) return "📦";
  if (choreName.includes("먼지") || choreName.includes("닦기")) return "🧽";
  if (choreName.includes("창문") || choreName.includes("유리")) return "🪟";

  return "📝";
};
