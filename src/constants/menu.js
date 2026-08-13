import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Home,
  Megaphone,
  RotateCcw,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export const PRIMARY_MENU_ITEMS = [
  {
    to: "/home",
    label: "홈",
    icon: Home,
  },
  {
    to: "/rotation",
    label: "로테이션",
    icon: RotateCcw,
  },
  {
    to: "/task",
    label: "업무 · 일정",
    icon: ClipboardList,
  },
  {
    to: "/members",
    label: "멤버",
    icon: Users,
  },
  {
    to: "/reservation",
    label: "공간 예약",
    icon: CalendarDays,
  },
];

export const SECONDARY_MENU_ITEMS = [
  {
    to: "/notice",
    label: "공지",
    icon: Megaphone,
  },
  {
    to: "/notification",
    label: "알림",
    icon: BellRing,
    badge: 0,
  },
  {
    to: "/completed-tasks",
    label: "완료 업무",
    icon: CheckCircle2,
  },
  {
    to: "/settings",
    label: "설정 · 규칙",
    icon: Settings,
  },
  {
    to: "/account",
    label: "계정",
    icon: UserRound,
  },
];