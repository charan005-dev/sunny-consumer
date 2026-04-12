import { ChevronRight } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const MILESTONES = [
  { name: "First preventive screening done", color: "#16a34a", amount: 25, date: "Sep 12" },
  { name: "Completed 5 wellness actions", color: "#2563eb", amount: 10, date: "Sep 8" },
  { name: "$25 earned", color: "#16a34a", amount: 5, date: "Sep 3" },
  { name: "Complete wellness assessment", color: "#16a34a", amount: 20, date: "Aug 28" },
  { name: "Step it up challenge", color: "#16a34a", amount: 10, date: "Aug 20" },
];

export default function RecentActivityVariantA({ props }: Props) {
  const theme = useTheme();
  const maxItems = (props.maxItems as number) ?? 5;
  const showViewAll = (props.showViewAll as boolean) ?? true;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
          <span className="text-sm font-semibold text-gray-900">Today, September 15, 2025</span>
        </div>
        {showViewAll && (
          <button className="flex items-center gap-0.5 text-xs font-medium" style={{ color: theme.linkColor }}>
            See more <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Timeline — scrollable */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="relative pl-5 border-l-2 border-gray-100 ml-1">
          {MILESTONES.slice(0, maxItems).map((item, i) => (
            <div key={i} className="relative pb-3 last:pb-0">
              <div className="absolute -left-[13px] top-0.5 w-4 h-4 rounded-full border-[3px] border-white" style={{ backgroundColor: item.color }} />
              <div className="pl-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-800 font-medium">{item.name}</div>
                  <div className="text-[10px] text-gray-400">{item.date}</div>
                </div>
                <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: theme.successColor }}>+${item.amount}.00</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom summary */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
        <div>
          <div className="text-[10px] text-gray-400">Actions</div>
          <div className="text-lg font-bold text-gray-900">5</div>
        </div>
        <div className="text-2xl font-bold text-gray-900">$50.00</div>
      </div>

      {/* Footer link */}
      <div className="border-t border-gray-50 px-5 py-2 shrink-0">
        <button className="text-xs font-medium flex items-center gap-1" style={{ color: theme.linkColor }}>
          Recent activity <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
