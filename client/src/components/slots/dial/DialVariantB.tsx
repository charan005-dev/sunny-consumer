import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

// === BAR STYLE ===
function BarRounded({ pct, theme }: { pct: number; theme: TenantTheme }) {
  return <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: theme.dialStroke }} /></div>;
}
function BarThick({ pct, theme }: { pct: number; theme: TenantTheme }) {
  return <div className="w-full bg-gray-100 rounded-lg h-5 overflow-hidden"><div className="h-full rounded-lg transition-all" style={{ width: `${pct}%`, backgroundColor: theme.dialStroke }} /></div>;
}
function BarSegmented({ pct, theme }: { pct: number; theme: TenantTheme }) {
  const segments = 10;
  const filled = Math.round((pct / 100) * segments);
  return <div className="flex gap-1">{Array.from({ length: segments }, (_, i) => <div key={i} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: i < filled ? theme.dialStroke : "#e5e7eb" }} />)}</div>;
}
function BarGradient({ pct, theme }: { pct: number; theme: TenantTheme }) {
  return <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.dialStroke}, ${theme.dialStroke}88)` }} /></div>;
}
const BARS: Record<string, typeof BarRounded> = { rounded: BarRounded, thick: BarThick, segmented: BarSegmented, gradient: BarGradient };

// === NUMBER FONT ===
const FONTS: Record<string, string> = {
  bold: "text-4xl font-bold font-sans",
  serif: "text-4xl font-bold font-serif italic",
  mono: "text-3xl font-bold font-mono",
  thin: "text-5xl font-extralight font-sans",
};

// === FOOTER STYLE ===
function FooterDefault({ earned, max }: { earned: number; max: number; theme: TenantTheme }) {
  return (
    <div className="flex justify-between mt-2 text-xs">
      <span className="text-gray-400"><span className="font-semibold text-gray-900">${earned}</span> Earned</span>
      <span className="text-gray-400">Max <span className="font-semibold text-gray-900">${max}</span></span>
    </div>
  );
}
function FooterBadge({ earned, max, theme }: { earned: number; max: number; theme: TenantTheme }) {
  return (
    <div className="flex justify-center gap-2 mt-2">
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}>${earned} earned</span>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">${max} max</span>
    </div>
  );
}
function FooterHidden(_p: { earned: number; max: number; theme: TenantTheme }) { return <></>; }
const FOOTERS: Record<string, typeof FooterDefault> = { default: FooterDefault, badge: FooterBadge, hidden: FooterHidden };

// === MAIN ===
export default function DialVariantB({ props }: Props) {
  const theme = useTheme();
  const earned = (props.earned as number) ?? 75;
  const max = (props.max as number) ?? 150;
  const left = max - earned;
  const pct = Math.min((earned / max) * 100, 100);
  const barStyle = (props.barStyle as string) ?? "rounded";
  const numberFont = (props.numberFont as string) ?? "bold";
  const labelStyle = (props.labelStyle as string) ?? "inline";
  const footerStyle = (props.footerStyle as string) ?? "default";

  const Bar = BARS[barStyle] ?? BarRounded;
  const font = FONTS[numberFont] ?? FONTS.bold;
  const Footer = FOOTERS[footerStyle] ?? FooterDefault;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-1" data-sub-key="title" data-sub-label="Title">
        <h3 className="text-base font-bold text-gray-900">My rewards</h3>
        <p className="text-[11px] text-gray-400">Track your earnings progress.</p>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-3" data-sub-key="number" data-sub-label="Number">
          <span className={`text-gray-900 ${font}`}>${left}</span>
          {labelStyle === "inline" && <span className="text-gray-400 ml-2 text-sm">left to earn</span>}
          {labelStyle === "below" && <div className="text-xs text-gray-400 mt-0.5">left to earn</div>}
        </div>
        <div data-sub-key="bar" data-sub-label="Progress Bar">
          <Bar pct={pct} theme={theme} />
        </div>
        <div data-sub-key="footer" data-sub-label="Footer">
          <Footer earned={earned} max={max} theme={theme} />
        </div>
      </div>
    </div>
  );
}
