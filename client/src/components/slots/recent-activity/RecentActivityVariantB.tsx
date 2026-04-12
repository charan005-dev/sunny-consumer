import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const SAMPLE_ACTIVITIES = [
  { name: "First preventive screening done", amount: 25, date: "Sep 12" },
  { name: "Completed 5 wellness actions", amount: 10, date: "Sep 8" },
  { name: "Play health trivia", amount: 5, date: "Sep 3" },
  { name: "Complete wellness assessment", amount: 20, date: "Aug 28" },
  { name: "Step it up challenge", amount: 10, date: "Aug 20" },
];

export default function RecentActivityVariantB({ props }: Props) {
  const theme = useTheme();
  const maxItems = (props.maxItems as number) ?? 5;
  const items = SAMPLE_ACTIVITIES.slice(0, maxItems);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h3 className="font-bold text-gray-900">Recent activity</h3>
        <span className="text-xs text-gray-400">September 2025</span>
      </div>

      {/* Timeline — fills space */}
      <div className="flex-1 overflow-y-auto relative pl-7">
        <div className="absolute left-[11px] top-1 bottom-1 w-0.5" style={{ backgroundColor: theme.primaryLight }} />
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: i === 0 ? theme.primary : theme.successColor }} />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.date}</div>
                </div>
                <span className="font-semibold text-sm shrink-0 ml-2" style={{ color: theme.successColor }}>+${item.amount}.00</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
