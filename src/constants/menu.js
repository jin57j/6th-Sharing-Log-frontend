import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Home,
  RotateCcw,
  Settings,
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
    label: "업무 관리",
    icon: ClipboardList,
  },
  {
    to: "/completed-tasks",
    label: "완료 업무",
    icon: CheckCircle2,
  },
  {
    to: "/reservation",
    label: "공간 예약",
    icon: CalendarDays,
  },
];

export const SECONDARY_MENU_ITEMS = [
  {
    to: "/members",
    label: "멤버",
    icon: Users,
  },
  {
    to: "/notification",
    label: "알림",
    icon: BellRing,
    badge: 0,
  },
  {
    to: "/settings",
    label: "설정",
    icon: Settings,
  },
];
