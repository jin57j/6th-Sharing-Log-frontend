import broomIcon from "../assets/icon/broom_icon.svg";
import defaultIcon from "../assets/icon/default_icon.svg";
import dishIcon from "../assets/icon/dish_icon.svg";
import fridgeIcon from "../assets/icon/fridge_icon.svg";
import laundryIcon from "../assets/icon/laundry_icon.svg";
import shoppingIcon from "../assets/icon/shopping_icon.svg";
import storageIcon from "../assets/icon/storage_icon.svg";
import toiletIcon from "../assets/icon/toilet_icon.svg";
import trashIcon from "../assets/icon/trash_icon.svg";
import windowIcon from "../assets/icon/window_icon.svg";

export const getChoreIcon = (choreName = "") => {
  if (choreName.includes("쓰레기") || choreName.includes("분리수거")) {
    return trashIcon;
  }

  if (
    choreName.includes("주방") ||
    choreName.includes("설거지") ||
    choreName.includes("식기")
  ) {
    return dishIcon;
  }

  if (choreName.includes("화장실") || choreName.includes("욕실")) return toiletIcon;
  if (choreName.includes("빨래") || choreName.includes("세탁") || choreName.includes("건조")) return laundryIcon;
  if (choreName.includes("청소") || choreName.includes("바닥") || choreName.includes("거실")) return broomIcon;
  if (choreName.includes("냉장고") || choreName.includes("음식") || choreName.includes("식재료")) return fridgeIcon;
  if (choreName.includes("장보기") || choreName.includes("구매") || choreName.includes("소모품")) return shoppingIcon;
  if (choreName.includes("정리") || choreName.includes("수납")) return storageIcon;
  if (choreName.includes("창문") || choreName.includes("유리")) return windowIcon;

  return defaultIcon;
};
