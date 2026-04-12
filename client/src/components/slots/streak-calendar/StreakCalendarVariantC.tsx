import { Flame, TrendingUp } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function StreakCalendarVariantC({ props }: Props) {
  const theme = useTheme();
  const streak = (props.streak as number) ?? 5;
  const monthlyData = (props.monthlyData as number[]) ?? [12, 18, 8, 22, 15, 20];

  const maxVal = Math.max(...monthlyData);
  const total = monthlyData.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Activity streak</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">+12% this month</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.primaryLight }}>
          <Flame className="w-3.5 h-3.5" style={{ color: theme.primary }} />
          <span className="text-xs font-bold" style={{ color: theme.activeText }}>{streak} days</span>
        </div>
      </div>

      {/* Bar chart — fills available space */}
      <div className="flex items-end gap-3 flex-1 pb-1">
        {MONTHS.map((month, i) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span className="text-[10px] font-medium text-gray-500">{monthlyData[i]}</span>
            <div
              className="w-full rounded-lg transition-all"
              style={{
                height: `${(monthlyData[i] / maxVal) * 100}%`,
                backgroundColor: i === MONTHS.length - 1 ? theme.primary : theme.primaryLight,
                minHeight: 8,
              }}
            />
            <span className="text-[10px] text-gray-400">{month}</span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
        <div>
          <div className="text-lg font-bold text-gray-900">{streak}</div>
          <div className="text-[10px] text-gray-400">Current streak</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{monthlyData[monthlyData.length - 1]}</div>
          <div className="text-[10px] text-gray-400">This month</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{total}</div>
          <div className="text-[10px] text-gray-400">Total days</div>
        </div>
      </div>
    </div>
  );
}
