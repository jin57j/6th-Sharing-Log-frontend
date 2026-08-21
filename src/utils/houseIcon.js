const HOUSE_EMOJIS = [
  "🏡",
  "🏠",
  "🏘️",
];

export function getHouseEmoji(houseKey) {
  const safeKey = String(houseKey ?? "").trim();

  if (!safeKey) {
    return HOUSE_EMOJIS[0];
  }

  let hash = 0;

  for (let index = 0; index < safeKey.length; index += 1) {
    hash = (hash * 31 + safeKey.charCodeAt(index)) | 0;
  }

  const emojiIndex = (hash >>> 0) % HOUSE_EMOJIS.length;
  return HOUSE_EMOJIS[emojiIndex];
}
