import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

// === NUMBER DISPLAY ===
const DISPLAY_FONTS: Record<string, string> = {
  bold: "text-5xl font-bold font-sans",
  serif: "text-5xl font-bold font-serif italic",
  mono: "text-4xl font-bold font-mono tracking-tight",
  jumbo: "text-6xl font-black font-sans",
};

// === SEPARATOR STYLE ===
function SepLine() { return <div className="w-px bg-gray-100" />; }
function SepDot() { return <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />; }
function SepNone() { return <div className="w-4" />; }
const SEPS: Record<string, () => React.ReactNode> = { line: SepLine, dot: SepDot, none: SepNone };

// === STATS STYLE ===
function StatsVertical({ earned, max, theme, sep }: { earned: number; max: number; theme: TenantTheme; sep: React.ReactNode }) {
  return (
    <div className="flex gap-4 pt-3 border-t border-gray-100 justify-center">
      <div><div className="text-xl font-bold" style={{ color: theme.dialStroke }}>${earned}</div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Earned</div></div>
      {sep}
      <div><div className="text-xl font-bold text-gray-800">${max}</div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Maximum</div></div>
    </div>
  );
}
function StatsHorizontal({ earned, max, theme }: { earned: number; max: number; theme: TenantTheme; sep: React.ReactNode }) {
  return (
    <div className="pt-3 border-t border-gray-100 flex justify-between px-4">
      <span className="text-xs"><span className="font-bold" style={{ color: theme.dialStroke }}>${earned}</span> earned</span>
      <span className="text-xs"><span className="font-bold text-gray-800">${max}</span> max</span>
    </div>
  );
}
function StatsBadge({ earned, max, theme }: { earned: number; max: number; theme: TenantTheme; sep: React.ReactNode }) {
  return (
    <div className="pt-3 flex justify-center gap-2">
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}>${earned} earned</span>
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">${max} max</span>
    </div>
  );
}
const STAT_STYLES: Record<string, typeof StatsVertical> = { vertical: StatsVertical, horizontal: StatsHorizontal, badge: StatsBadge };

// === SUBTITLE ===
const SUBTITLES: Record<string, string> = {
  default: "left to earn",
  remaining: "remaining rewards",
  progress: "still available",
};

// === MAIN ===
export default function DialVariantC({ props }: Props) {
  const theme = useTheme();
  const earned = (props.earned as number) ?? 75;
  const max = (props.max as number) ?? 150;
  const left = max - earned;
  const displayFont = (props.displayFont as string) ?? "bold";
  const sepStyle = (props.sepStyle as string) ?? "line";
  const statsStyle = (props.statsStyle as string) ?? "vertical";
  const subtitle = (props.subtitle as string) ?? "default";

  const font = DISPLAY_FONTS[displayFont] ?? DISPLAY_FONTS.bold;
  const Sep = SEPS[sepStyle] ?? SepLine;
  const Stats = STAT_STYLES[statsStyle] ?? StatsVertical;
  const subtitleText = SUBTITLES[subtitle] ?? SUBTITLES.default;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col text-center">
      <h3 className="text-base font-bold text-gray-900 mb-1">My rewards</h3>
      <div className="flex-1 flex flex-col justify-center">
        <div data-sub-key="display" data-sub-label="Number Display">
          <div className={`text-gray-900 ${font}`}>${left}</div>
        </div>
        <div data-sub-key="subtitle" data-sub-label="Subtitle" className="text-gray-400 text-sm mt-1">{subtitleText}</div>
      </div>
      <div data-sub-key="stats" data-sub-label="Stats">
        <Stats earned={earned} max={max} theme={theme} sep={<Sep />} />
      </div>
    </div>
  );
}
