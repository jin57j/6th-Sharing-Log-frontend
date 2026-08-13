import { Star } from "lucide-react";

import {
  getInitial,
  getMemberColor,
} from "../../utils/memberUtils";

const SIZE_STYLES = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-base",
};

const OWNER_BADGE_STYLES = {
  xs: "hidden",
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

function MemberAvatar({
  name,
  memberId,
  size = "md",
  isOwner = false,
}) {
  const avatarColor = getMemberColor(
    memberId || name,
  );

  return (
    <span className="relative inline-flex shrink-0">
      <span
        role="img"
        aria-label={`${name || "멤버"} 프로필`}
        className={`inline-flex items-center justify-center rounded-full font-black text-white ${
          SIZE_STYLES[size] ?? SIZE_STYLES.md
        }`}
        style={{
          backgroundColor: avatarColor,
        }}
      >
        {getInitial(name)}
      </span>

      {isOwner && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-[#E63946] text-white shadow-sm ${
            OWNER_BADGE_STYLES[size] ??
            OWNER_BADGE_STYLES.md
          }`}
        >
          <Star
            size={9}
            fill="currentColor"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}

export default MemberAvatar;