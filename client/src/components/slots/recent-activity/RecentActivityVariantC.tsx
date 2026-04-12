import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const SAMPLE_ACTIVITIES = [
  { name: "Preventive screening", amount: 25, date: "Sep 12" },
  { name: "5 wellness actions", amount: 10, date: "Sep 8" },
  { name: "Health trivia", amount: 5, date: "Sep 3" },
  { name: "Wellness assessment", amount: 20, date: "Aug 28" },
  { name: "Step it up", amount: 10, date: "Aug 20" },
];

export default function RecentActivityVariantC({ props }: Props) {
  const theme = useTheme();
  const maxItems = (props.maxItems as number) ?? 3;
  const items = SAMPLE_ACTIVITIES.slice(0, maxItems);
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="font-bold text-gray-900 text-sm mb-3 shrink-0">Recent activity</h3>

      {/* Activity list — fills space */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.successColor }} />
              <div>
                <span className="text-sm text-gray-700">{item.name}</span>
                <div className="text-[10px] text-gray-400">{item.date}</div>
              </div>
            </div>
            <span className="font-semibold text-sm shrink-0" style={{ color: theme.successColor }}>+${item.amount}</span>
          </div>
        ))}
      </div>

      {/* Total + View all */}
      <div className="shrink-0 pt-3 border-t border-gray-100 mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Total earned</span>
          <span className="text-lg font-bold text-gray-900">${total}.00</span>
        </div>
        <button
          className="w-full py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}
        >
          View all
        </button>
      </div>
    </div>
  );
}
