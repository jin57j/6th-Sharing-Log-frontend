const CHORE_ICON_RULES = [
  {
    keywords: ["분리수거", "재활용"],
    icon: "♻️",
  },
  {
    keywords: ["음식물", "음쓰"],
    icon: "🍌",
  },
  {
    keywords: ["쓰레기"],
    icon: "🗑️",
  },
  {
    keywords: ["주방", "설거지", "식기"],
    icon: "🍽️",
  },
  {
    keywords: ["요리", "식사 준비", "밥하기"],
    icon: "🍳",
  },
  {
    keywords: ["화장실", "욕실"],
    icon: "🚽",
  },
  {
    keywords: ["빨래", "세탁", "건조"],
    icon: "🧺",
  },
  {
    keywords: ["침구", "이불", "침대"],
    icon: "🛏️",
  },
  {
    keywords: ["청소기", "바닥", "거실", "청소"],
    icon: "🧹",
  },
  {
    keywords: ["먼지", "닦기", "걸레", "물걸레"],
    icon: "🧽",
  },
  {
    keywords: ["냉장고", "식재료", "유통기한"],
    icon: "🧊",
  },
  {
    keywords: ["장보기", "구매", "소모품"],
    icon: "🛒",
  },
  {
    keywords: ["택배", "우편", "편지"],
    icon: "📬",
  },
  {
    keywords: ["정리", "수납", "창고"],
    icon: "📦",
  },
  {
    keywords: ["창문", "유리"],
    icon: "🪟",
  },
  {
    keywords: ["환기", "공기"],
    icon: "🌬️",
  },
  {
    keywords: ["식물", "화분", "물주기"],
    icon: "🪴",
  },
  {
    keywords: ["반려동물", "강아지", "고양이", "사료"],
    icon: "🐾",
  },
  {
    keywords: ["신발", "현관"],
    icon: "👟",
  },
  {
    keywords: ["공과금", "월세", "정산", "납부"],
    icon: "🧾",
  },
  {
    keywords: ["문단속", "잠금", "보안"],
    icon: "🔐",
  },
  {
    keywords: ["에어컨", "난방", "보일러", "온도"],
    icon: "🌡️",
  },
  {
    keywords: ["전등", "조명", "전기", "불 끄기"],
    icon: "💡",
  },
  {
    keywords: ["정수기", "수도", "필터"],
    icon: "🚰",
  },
  {
    keywords: ["휴지", "화장지", "티슈"],
    icon: "🧻",
  },
  {
    keywords: ["수리", "고치기", "점검"],
    icon: "🔧",
  },
  {
    keywords: ["베란다", "발코니"],
    icon: "🌤️",
  },
];

export const getChoreIcon = (
  choreName = "",
) => {
  const matchedRule =
    CHORE_ICON_RULES.find(
      ({ keywords }) =>
        keywords.some((keyword) =>
          choreName.includes(keyword),
        ),
    );

  return matchedRule?.icon ?? "📝";
};
