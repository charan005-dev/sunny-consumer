import { ChevronRight, SlidersHorizontal, Ticket } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const SAMPLE_ACTIONS = [
  { name: "Complete the total health assessment", reward: 20, desc: "Answer questions about your health", hasEntries: false },
  { name: "Take a stroll after a meal", reward: 10, desc: "Walk 15 minutes after eating", hasEntries: false },
  { name: "Meditate to boost your wellness", reward: 5, desc: "10 min guided meditation", hasEntries: false },
  { name: "Play health trivia", reward: 5, desc: "Test your wellness knowledge", hasEntries: true },
  { name: "Get your flu vaccine", reward: 20, desc: "Upload proof of vaccination", hasEntries: false },
  { name: "Start your wellness coaching", reward: 20, desc: "Schedule your first session", hasEntries: false },
  { name: "Rethink your drink", reward: 10, desc: "Track your hydration for a week", hasEntries: false },
  { name: "Get your z's", reward: 10, desc: "Log 7 hours of sleep for 5 days", hasEntries: false },
  { name: "Eat well to fuel your body", reward: 10, desc: "Complete a nutrition course", hasEntries: true },
];

// === BADGE SUB-VARIANTS ===
function BadgeSquare({ reward, theme }: { reward: number; theme: TenantTheme }) {
  return (
    <div className="text-sm font-bold rounded-2xl w-14 h-14 flex items-center justify-center shrink-0"
      style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
      ${reward}
    </div>
  );
}

function BadgePill({ reward, theme }: { reward: number; theme: TenantTheme }) {
  return (
    <div className="text-xs font-bold rounded-full px-3.5 py-2 shrink-0"
      style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}>
      ${reward}
    </div>
  );
}

function BadgeCircle({ reward, theme }: { reward: number; theme: TenantTheme }) {
  return (
    <div className="text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0 border-2"
      style={{ borderColor: theme.primary, color: theme.primary }}>
      ${reward}
    </div>
  );
}

const BADGES: Record<string, typeof BadgeSquare> = { square: BadgeSquare, pill: BadgePill, circle: BadgeCircle };

// === CARD LAYOUT SUB-VARIANTS ===
function CardRow({ action, badge, theme }: { action: typeof SAMPLE_ACTIONS[0]; badge: React.ReactNode; theme: TenantTheme }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
      {badge}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm leading-snug">{action.name}</div>
        {action.hasEntries && (
          <div className="flex items-center gap-1 mt-1">
            <Ticket className="w-3 h-3" style={{ color: theme.primary }} />
            <span className="text-xs font-medium" style={{ color: theme.primary }}>Entries</span>
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
    </div>
  );
}

function CardCompact({ action, badge }: { action: typeof SAMPLE_ACTIONS[0]; badge: React.ReactNode; theme: TenantTheme }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      {badge}
      <span className="font-medium text-gray-800 text-xs flex-1 truncate">{action.name}</span>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
    </div>
  );
}

function CardStacked({ action, badge, theme }: { action: typeof SAMPLE_ACTIONS[0]; badge: React.ReactNode; theme: TenantTheme }) {
  return (
    <div className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        {badge}
        {action.hasEntries && (
          <div className="flex items-center gap-1">
            <Ticket className="w-3 h-3" style={{ color: theme.primary }} />
            <span className="text-[10px] font-medium" style={{ color: theme.primary }}>Entries</span>
          </div>
        )}
      </div>
      <div className="font-medium text-gray-900 text-sm leading-snug">{action.name}</div>
      <div className="text-xs text-gray-400 mt-0.5">{action.desc}</div>
    </div>
  );
}

const CARDS: Record<string, typeof CardRow> = { row: CardRow, compact: CardCompact, stacked: CardStacked };

// === HEADER SUB-VARIANTS ===
function HeaderDefault() {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-gray-900">Actions for you</h3>
      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
        High to low
        <SlidersHorizontal className="w-3 h-3" />
      </button>
    </div>
  );
}

function HeaderMinimal() {
  return <h3 className="font-bold text-gray-900 text-lg">Actions for you</h3>;
}

function HeaderWithCount() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-gray-900">Actions for you</h3>
        <span className="text-xs text-gray-400">{SAMPLE_ACTIONS.length} available</span>
      </div>
      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
        Filter <SlidersHorizontal className="w-3 h-3" />
      </button>
    </div>
  );
}

const HEADERS: Record<string, typeof HeaderDefault> = { default: HeaderDefault, minimal: HeaderMinimal, withCount: HeaderWithCount };

// === MAIN COMPONENT ===
export default function ActionsListVariantA({ props }: Props) {
  const theme = useTheme();
  const badgeStyle = (props.badgeStyle as string) ?? "square";
  const cardStyle = (props.cardStyle as string) ?? "row";
  const headerStyle = (props.headerStyle as string) ?? "default";

  const Badge = BADGES[badgeStyle] ?? BadgeSquare;
  const Card = CARDS[cardStyle] ?? CardRow;
  const Header = HEADERS[headerStyle] ?? HeaderDefault;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header — clickable sub-component */}
      <div className="px-5 pt-5 pb-3 shrink-0" data-sub-key="header" data-sub-label="Header">
        <Header />
      </div>

      {/* Action cards */}
      <div className="px-3 pb-3 space-y-2 flex-1 overflow-y-auto">
        {SAMPLE_ACTIONS.map((action) => (
          <div key={action.name}>
            <Card
              action={action}
              badge={
                <div data-sub-key="badge" data-sub-label="Reward Badge">
                  <Badge reward={action.reward} theme={theme} />
                </div>
              }
              theme={theme}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
