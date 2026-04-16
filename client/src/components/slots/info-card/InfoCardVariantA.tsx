import { Info, Trophy, Gift, Star } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

// === ICON ===
const ICONS: Record<string, () => React.ReactNode> = {
  trophy: () => <Trophy className="w-4 h-4 opacity-70" />,
  gift: () => <Gift className="w-4 h-4 opacity-70" />,
  star: () => <Star className="w-4 h-4 opacity-70" />,
};

// === TITLE FONT ===
const TITLE_FONTS: Record<string, string> = {
  sans: "font-sans text-sm font-medium",
  serif: "font-serif text-sm font-medium italic",
  mono: "font-mono text-xs font-medium tracking-tight",
  uppercase: "font-sans text-xs font-bold uppercase tracking-wider",
};

// === ENTRIES DISPLAY ===
function EntriesLarge({ entries }: { entries: number }) {
  return <div className="text-3xl font-bold mb-1">{entries} Entries earned</div>;
}
function EntriesBadge({ entries }: { entries: number }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-2xl font-bold">{entries}</span>
      <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">entries earned</span>
    </div>
  );
}
function EntriesCircle({ entries }: { entries: number }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-xl font-bold">{entries}</div>
      <span className="text-sm font-medium opacity-80">entries earned</span>
    </div>
  );
}
function EntriesMinimal({ entries }: { entries: number }) {
  return <div className="text-lg font-bold mb-1">{entries} entries</div>;
}
const ENTRIES: Record<string, typeof EntriesLarge> = { large: EntriesLarge, badge: EntriesBadge, circle: EntriesCircle, minimal: EntriesMinimal };

// === BACKGROUND ===
const BGS: Record<string, () => React.ReactNode> = {
  circles: () => <><div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-white/10" /><div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full border border-white/10" /></>,
  dots: () => <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />,
  diagonal: () => <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 10px)" }} />,
  clean: () => null,
};

// === DATE DISPLAY ===
function DateDefault({ nextDrawing }: { nextDrawing: string }) {
  return <div className="text-sm opacity-60">Next drawing {nextDrawing}</div>;
}
function DateBadge({ nextDrawing }: { nextDrawing: string }) {
  return <div className="inline-block text-[10px] font-medium bg-white/15 px-2.5 py-1 rounded-full mt-1">Drawing: {nextDrawing}</div>;
}
function DateHidden(_p: { nextDrawing: string }) { return <></>; }
const DATES: Record<string, typeof DateDefault> = { default: DateDefault, badge: DateBadge, hidden: DateHidden };

// === LAYOUT ===
function LayoutStandard({ icon, title, titleFont, entries, date, info }: LayoutProps) {
  return (
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">{icon}<span className={titleFont}>{title}</span></div>
        {info}
      </div>
      {entries}
      {date}
      <div className="flex gap-1.5 mt-4"><div className="w-2 h-2 rounded-full bg-white" /><div className="w-2 h-2 rounded-full bg-white/30" /></div>
    </div>
  );
}
function LayoutCentered({ icon, title, titleFont, entries, date, info: _info }: LayoutProps) {
  return (
    <div className="relative text-center">
      <div className="flex items-center justify-center gap-2 mb-2">{icon}<span className={titleFont}>{title}</span></div>
      <div className="my-3">{entries}</div>
      {date}
      <div className="flex gap-1.5 mt-4 justify-center"><div className="w-2 h-2 rounded-full bg-white" /><div className="w-2 h-2 rounded-full bg-white/30" /></div>
    </div>
  );
}
function LayoutCompact({ icon, title, titleFont, entries, date, info: _info }: LayoutProps) {
  return (
    <div className="relative flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">{icon}<span className={titleFont}>{title}</span></div>
        {date}
      </div>
      <div className="text-right">{entries}</div>
    </div>
  );
}

interface LayoutProps {
  icon: React.ReactNode;
  title: string;
  titleFont: string;
  entries: React.ReactNode;
  date: React.ReactNode;
  info: React.ReactNode;
}
const LAYOUTS: Record<string, typeof LayoutStandard> = { standard: LayoutStandard, centered: LayoutCentered, compact: LayoutCompact };

// === MAIN ===
export default function InfoCardVariantA({ props }: Props) {
  const theme = useTheme();
  const title = (props.title as string) ?? "Your chance to win $100 each month";
  const entries = (props.entries as number) ?? 3;
  const nextDrawing = (props.nextDrawing as string) ?? "3/15/25";
  const iconStyle = (props.iconStyle as string) ?? "trophy";
  const titleFontKey = (props.titleFont as string) ?? "sans";
  const entriesStyle = (props.entriesStyle as string) ?? "large";
  const bgStyle = (props.bgStyle as string) ?? "circles";
  const dateStyle = (props.dateStyle as string) ?? "default";
  const layoutStyle = (props.layoutStyle as string) ?? "standard";

  const Icon = ICONS[iconStyle] ?? ICONS.trophy;
  const titleFont = TITLE_FONTS[titleFontKey] ?? TITLE_FONTS.sans;
  const Entries = ENTRIES[entriesStyle] ?? EntriesLarge;
  const Bg = BGS[bgStyle] ?? BGS.circles;
  const DateDisplay = DATES[dateStyle] ?? DateDefault;
  const Layout = LAYOUTS[layoutStyle] ?? LayoutStandard;

  const infoBtn = (
    <button className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center shrink-0 hover:bg-white/10">
      <Info className="w-3 h-3" />
    </button>
  );

  return (
    <div className="rounded-2xl p-5 text-white shadow-sm relative overflow-hidden h-full" style={{ backgroundColor: theme.cardBg }}>
      <div data-sub-key="background" data-sub-label="Background"><Bg /></div>
      <div data-sub-key="layout" data-sub-label="Card Layout">
        <Layout
          icon={<div className="inline-flex" data-sub-key="icon" data-sub-label="Icon"><Icon /></div>}
          title={title}
          titleFont={titleFont}
          entries={<div data-sub-key="entries" data-sub-label="Entries"><Entries entries={entries} /></div>}
          date={<div data-sub-key="date" data-sub-label="Date Display"><DateDisplay nextDrawing={nextDrawing} /></div>}
          info={infoBtn}
        />
      </div>
    </div>
  );
}
