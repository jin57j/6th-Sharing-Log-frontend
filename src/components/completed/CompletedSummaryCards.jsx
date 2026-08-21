import {
  AlertTriangle,
  CheckCircle2,
  History,
} from "lucide-react";

import SummaryCard from "./SummaryCard";

export default function CompletedSummaryCards({
  completedCount,
  overdueCount,
  substituteCount,
}) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <SummaryCard
        icon={CheckCircle2}
        label="완료"
        count={completedCount}
        colorClass="bg-[#DDF3E5] text-[#1C6B42]"
      />
      <SummaryCard
        icon={AlertTriangle}
        label="미완료"
        count={overdueCount}
        colorClass="bg-[#FFF0E8] text-[#A64A24]"
      />
      <SummaryCard
        icon={History}
        label="대타 완료"
        count={substituteCount}
        colorClass="bg-[#E63946]/10 text-[#E63946]"
      />
    </div>
  );
}
