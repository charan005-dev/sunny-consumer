import { Flame, Check } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const WEEK_DAYS = [
  { day: "Mon", date: 7 },
  { day: "Tue", date: 8 },
  { day: "Wed", date: 9 },
  { day: "Thu", date: 10 },
  { day: "Fri", date: 11 },
  { day: "Sat", date: 12 },
  { day: "Sun", date: 13 },
];

const MILESTONES = [
  { days: 3, label: "3 days", reached: true },
  { days: 5, label: "5 days", reached: true },
  { days: 7, label: "1 week", reached: false },
  { days: 14, label: "2 weeks", reached: false },
  { days: 30, label: "1 month", reached: false },
];

export default function StreakCalendarVariantB({ props }: Props) {
  const theme = useTheme();
  const streak = (props.streak as number) ?? 5;
  const completedDays = (props.completedDays as number[]) ?? [0, 1, 2, 3, 4];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">This week</h3>
          <p className="text-xs text-gray-400 mt-0.5">{streak} day streak</p>
        </div>
        <div className="flex items-center gap-1" style={{ color: theme.primary }}>
          <Flame className="w-5 h-5" />
          <span className="text-lg font-bold">{streak}</span>
        </div>
      </div>

      {/* Weekly circles */}
      <div className="flex gap-2 mb-4">
        {WEEK_DAYS.map((item, i) => {
          const done = completedDays.includes(i);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-[10px] text-gray-400 font-medium">{item.day}</div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: done ? theme.primary : "#f3f4f6",
                  color: done ? "#fff" : "#d1d5db",
                }}
              >
                {done ? <Check className="w-4 h-4" /> : <span className="text-xs">{item.date}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${(completedDays.length / 7) * 100}%`, backgroundColor: theme.primary }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">{completedDays.length}/7</span>
      </div>

      {/* Milestones */}
      <div className="flex-1 flex items-end">
        <div className="flex gap-2 w-full">
          {MILESTONES.map((m) => (
            <div key={m.days} className="flex-1 text-center">
              <div
                className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center"
                style={{
                  backgroundColor: m.reached ? theme.primaryLight : "#f3f4f6",
                  color: m.reached ? theme.primary : "#d1d5db",
                }}
              >
                {m.reached ? <Check className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
              </div>
              <div className="text-[9px] text-gray-400">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
