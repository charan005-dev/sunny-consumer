import { Flame, Check, Star } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// === CELL ICON SUB-VARIANTS ===
function CellFlame({ completed, day }: { completed: boolean; day: number }) {
  return completed ? <Flame className="w-3 h-3" /> : <span>{day}</span>;
}
function CellCheck({ completed, day }: { completed: boolean; day: number }) {
  return completed ? <Check className="w-3 h-3" /> : <span>{day}</span>;
}
function CellStar({ completed, day }: { completed: boolean; day: number }) {
  return completed ? <Star className="w-3 h-3" /> : <span>{day}</span>;
}
function CellDot({ completed, day }: { completed: boolean; day: number }) {
  return completed ? <div className="w-2 h-2 rounded-full bg-white" /> : <span>{day}</span>;
}
const CELLS: Record<string, typeof CellFlame> = { flame: CellFlame, check: CellCheck, star: CellStar, dot: CellDot };

// === BADGE SUB-VARIANTS ===
function BadgePill({ streak, theme }: { streak: number; theme: TenantTheme }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.primaryLight }}>
      <Flame className="w-3.5 h-3.5" style={{ color: theme.primary }} />
      <span className="text-xs font-bold" style={{ color: theme.activeText }}>{streak} days</span>
    </div>
  );
}
function BadgeNumber({ streak, theme }: { streak: number; theme: TenantTheme }) {
  return (
    <div className="flex items-center gap-1" style={{ color: theme.primary }}>
      <Flame className="w-4 h-4" />
      <span className="text-lg font-bold">{streak}</span>
    </div>
  );
}
function BadgeText({ streak }: { streak: number; theme: TenantTheme }) {
  return <span className="text-xs font-medium text-gray-500">{streak} day streak</span>;
}
const BADGES: Record<string, typeof BadgePill> = { pill: BadgePill, number: BadgeNumber, text: BadgeText };

// === CELL SHAPE SUB-VARIANTS ===
function ShapeRounded({ completed, today, theme, children }: { completed: boolean; today: boolean; theme: TenantTheme; children: React.ReactNode }) {
  return (
    <div className={`rounded-md flex items-center justify-center text-[10px] font-medium ${today ? "ring-1 ring-offset-1" : ""}`}
      style={{ backgroundColor: completed ? theme.primary : "#f5f5f4", color: completed ? "#fff" : "#a8a29e" }}>
      {children}
    </div>
  );
}
function ShapeCircle({ completed, today, theme, children }: { completed: boolean; today: boolean; theme: TenantTheme; children: React.ReactNode }) {
  return (
    <div className={`rounded-full flex items-center justify-center text-[10px] font-medium aspect-square ${today ? "ring-1 ring-offset-1" : ""}`}
      style={{ backgroundColor: completed ? theme.primary : "#f5f5f4", color: completed ? "#fff" : "#a8a29e" }}>
      {children}
    </div>
  );
}
function ShapeSquare({ completed, today, theme, children }: { completed: boolean; today: boolean; theme: TenantTheme; children: React.ReactNode }) {
  return (
    <div className={`rounded-sm flex items-center justify-center text-[10px] font-medium ${today ? "ring-1 ring-offset-1" : ""}`}
      style={{ backgroundColor: completed ? theme.primary : "#f5f5f4", color: completed ? "#fff" : "#a8a29e" }}>
      {children}
    </div>
  );
}
const SHAPES: Record<string, typeof ShapeRounded> = { rounded: ShapeRounded, circle: ShapeCircle, square: ShapeSquare };

// === MAIN ===
export default function StreakCalendarVariantA({ props }: Props) {
  const theme = useTheme();
  const streak = (props.streak as number) ?? 5;
  const completedDays = (props.completedDays as number[]) ?? [0, 1, 2, 3, 4, 7, 8, 9, 10, 14, 15, 16, 17, 18];
  const cellIcon = (props.cellIcon as string) ?? "flame";
  const badgeStyle = (props.badgeStyle as string) ?? "pill";
  const cellShape = (props.cellShape as string) ?? "rounded";

  const CellContent = CELLS[cellIcon] ?? CellFlame;
  const Badge = BADGES[badgeStyle] ?? BadgePill;
  const Shape = SHAPES[cellShape] ?? ShapeRounded;

  const weeks = Array.from({ length: 4 }, (_, w) =>
    DAYS.map((_, d) => {
      const dayIndex = w * 7 + d;
      return { day: w * 7 + d + 1, completed: completedDays.includes(dayIndex), today: dayIndex === 18 };
    })
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-900">Streak calendar</h3>
        <div data-sub-key="badge" data-sub-label="Streak Badge">
          <Badge streak={streak} theme={theme} />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d, i) => <div key={i} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>)}
        </div>
        <div className="flex-1 grid grid-rows-4 gap-1" data-sub-key="cell" data-sub-label="Day Cell">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day, di) => (
                <Shape key={di} completed={day.completed} today={day.today} theme={theme}>
                  <CellContent completed={day.completed} day={day.day} />
                </Shape>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
