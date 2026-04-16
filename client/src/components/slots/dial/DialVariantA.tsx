import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

// === NUMBER FONT — how the big dollar amount renders inside gauges ===
const NUMBER_FONTS: Record<string, string> = {
  bold: "font-bold font-sans",
  serif: "font-bold font-serif italic",
  mono: "font-bold font-mono",
  thin: "font-extralight font-sans tracking-tight",
};

// === GAUGE SUB-VARIANTS ===
function GaugeArc({ left, pct, theme, numberFont }: { left: number; pct: number; theme: TenantTheme; numberFont: string }) {
  const radius = 70, strokeWidth = 14, center = 80;
  const startAngle = -220, endAngle = 40;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + totalAngle * pct;
  const polar = (a: number) => ({ x: center + radius * Math.cos(a * Math.PI / 180), y: center + radius * Math.sin(a * Math.PI / 180) });
  const arc = (s: number, e: number) => { const p1 = polar(s), p2 = polar(e); return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${e - s > 180 ? 1 : 0} 1 ${p2.x} ${p2.y}`; };
  const ticks = Array.from({ length: 25 }, (_, i) => {
    const angle = startAngle + (totalAngle * i) / 24;
    const isMajor = i % 4 === 0;
    const r1 = radius - strokeWidth / 2 - (isMajor ? 7 : 4), r2 = radius - strokeWidth / 2 - 1;
    const rad = angle * Math.PI / 180;
    return { x1: center + r1 * Math.cos(rad), y1: center + r1 * Math.sin(rad), x2: center + r2 * Math.cos(rad), y2: center + r2 * Math.sin(rad), isMajor };
  });
  return (
    <svg viewBox="0 0 160 120" className="w-[140px] shrink-0">
      <defs><linearGradient id="gA" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={theme.dialStroke} /><stop offset="100%" stopColor={theme.dialStroke} stopOpacity="0.5" /></linearGradient></defs>
      <path d={arc(startAngle, endAngle)} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={arc(startAngle, currentAngle)} fill="none" stroke="url(#gA)" strokeWidth={strokeWidth} strokeLinecap="round" />
      {ticks.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.isMajor ? "#9ca3af" : "#d1d5db"} strokeWidth={t.isMajor ? 1.5 : 0.8} />)}
      <foreignObject x={center - 50} y={center - 20} width="100" height="24">
        <div className={`text-center text-[28px] leading-none ${numberFont}`} style={{ color: "#111827" }}>${left}</div>
      </foreignObject>
      <text x={center} y={center + 14} textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="system-ui">Left to earn</text>
    </svg>
  );
}

function GaugeBar({ left, pct, theme, numberFont }: { left: number; pct: number; theme: TenantTheme; numberFont: string }) {
  return (
    <div className="w-[140px] shrink-0 text-center">
      <div className={`text-3xl text-gray-900 mb-1 ${numberFont}`}>${left}</div>
      <div className="text-[10px] text-gray-400 mb-2">left to earn</div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: theme.dialStroke }} />
      </div>
    </div>
  );
}

function GaugeRing({ left, pct, theme, numberFont }: { left: number; pct: number; theme: TenantTheme; numberFont: string }) {
  const r = 40, circ = 2 * Math.PI * r;
  return (
    <div className="w-[120px] shrink-0 flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={theme.dialStroke} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" transform="rotate(-90 50 50)" />
        <foreignObject x="10" y="32" width="80" height="22">
          <div className={`text-center text-[20px] leading-none ${numberFont}`} style={{ color: "#111827" }}>${left}</div>
        </foreignObject>
        <text x="50" y="62" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="system-ui">left</text>
      </svg>
    </div>
  );
}

const GAUGES: Record<string, typeof GaugeArc> = { arc: GaugeArc, bar: GaugeBar, ring: GaugeRing };

// === STATS SUB-VARIANTS ===
function StatsSideBySide({ earned, max, theme }: { earned: number; max: number; theme: TenantTheme }) {
  return (
    <div className="flex items-center justify-between flex-1">
      <div className="text-center"><div className="text-xl font-bold" style={{ color: theme.dialStroke }}>${earned}</div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Earned</div></div>
      <div className="text-center"><div className="text-xl font-bold text-gray-900">${max}</div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Maximum</div></div>
    </div>
  );
}
function StatsInline({ earned, max, theme }: { earned: number; max: number; theme: TenantTheme }) {
  return (
    <div className="flex items-center gap-3 flex-1 justify-center">
      <span className="text-sm"><span className="font-bold" style={{ color: theme.dialStroke }}>${earned}</span> <span className="text-gray-400">earned</span></span>
      <span className="text-gray-300">|</span>
      <span className="text-sm"><span className="font-bold text-gray-900">${max}</span> <span className="text-gray-400">max</span></span>
    </div>
  );
}
function StatsProgress({ earned, max, theme }: { earned: number; max: number; theme: TenantTheme }) {
  const pct = Math.min((earned / max) * 100, 100);
  return (
    <div className="flex-1 space-y-1.5">
      <div className="flex justify-between text-xs text-gray-500">
        <span style={{ color: theme.dialStroke }}>${earned}</span>
        <span>${max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: theme.dialStroke }} /></div>
    </div>
  );
}

const STATS: Record<string, typeof StatsSideBySide> = { sideBySide: StatsSideBySide, inline: StatsInline, progress: StatsProgress };

// === TITLE SUB-VARIANTS ===
function TitleDefault() {
  return <><h3 className="text-base font-bold text-gray-900 font-sans">My rewards</h3><p className="text-[11px] text-gray-400">Check out your actions below to start earning.</p></>;
}
function TitleSerif() {
  return <><h3 className="text-lg font-bold text-gray-900 font-serif">My rewards</h3><p className="text-[11px] text-gray-400 font-serif italic">Check out your actions below.</p></>;
}
function TitleBold() {
  return <><h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">My Rewards</h3><p className="text-[10px] text-gray-500 tracking-wide">YOUR EARNING PROGRESS</p></>;
}

const TITLES: Record<string, typeof TitleDefault> = { default: TitleDefault, serif: TitleSerif, bold: TitleBold };

// === MAIN ===
export default function DialVariantA({ props }: Props) {
  const theme = useTheme();
  const earned = (props.earned as number) ?? 75;
  const max = (props.max as number) ?? 150;
  const left = max - earned;
  const pct = Math.min(earned / max, 1);
  const gaugeStyle = (props.gaugeStyle as string) ?? "arc";
  const statsStyle = (props.statsStyle as string) ?? "sideBySide";
  const titleStyle = (props.titleStyle as string) ?? "default";
  const numberFontKey = (props.numberFont as string) ?? "bold";

  const numberFont = NUMBER_FONTS[numberFontKey] ?? NUMBER_FONTS.bold;
  const Gauge = GAUGES[gaugeStyle] ?? GaugeArc;
  const Stats = STATS[statsStyle] ?? StatsSideBySide;
  const Title = TITLES[titleStyle] ?? TitleDefault;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col p-4">
      <div className="mb-1" data-sub-key="title" data-sub-label="Title">
        <Title />
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div data-sub-key="gauge" data-sub-label="Gauge">
          <Gauge left={left} pct={pct} theme={theme} numberFont={numberFont} />
        </div>
        <div data-sub-key="stats" data-sub-label="Stats" className="flex-1">
          <Stats earned={earned} max={max} theme={theme} />
        </div>
      </div>
    </div>
  );
}
