import { Flame } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function StreakCalendarVariantA({ props }: Props) {
  const theme = useTheme();
  const streak = (props.streak as number) ?? 5;
  const completedDays = (props.completedDays as number[]) ?? [0, 1, 2, 3, 4, 7, 8, 9, 10, 14, 15, 16, 17, 18];

  const weeks = Array.from({ length: 4 }, (_, w) =>
    DAYS.map((_, d) => {
      const dayIndex = w * 7 + d;
      return { day: w * 7 + d + 1, completed: completedDays.includes(dayIndex), today: dayIndex === 18 };
    })
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-900">Streak calendar</h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.primaryLight }}>
          <Flame className="w-3.5 h-3.5" style={{ color: theme.primary }} />
          <span className="text-xs font-bold" style={{ color: theme.activeText }}>{streak} days</span>
        </div>
      </div>

      {/* Calendar — fills remaining space */}
      <div className="flex-1 flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>
          ))}
        </div>

        {/* Weeks grid — evenly distributed */}
        <div className="flex-1 grid grid-rows-4 gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`rounded-md flex items-center justify-center text-[10px] font-medium ${
                    day.today ? "ring-1 ring-offset-1" : ""
                  }`}
                  style={{
                    backgroundColor: day.completed ? theme.primary : "#f5f5f4",
                    color: day.completed ? "#fff" : "#a8a29e",
                    ...(day.today ? { outlineColor: theme.primary } : {}),
                  }}
                >
                  {day.completed ? <Flame className="w-3 h-3" /> : day.day}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
