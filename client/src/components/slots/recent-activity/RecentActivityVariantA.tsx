import { ChevronRight } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

interface Milestone {
  name: string;
  color: string;
  amount: number;
  date: string;
}

const MILESTONES: Milestone[] = [
  { name: "First preventive screening done", color: "#16a34a", amount: 25, date: "Sep 12" },
  { name: "Completed 5 wellness actions", color: "#2563eb", amount: 10, date: "Sep 8" },
  { name: "$25 earned", color: "#16a34a", amount: 5, date: "Sep 3" },
  { name: "Complete wellness assessment", color: "#16a34a", amount: 20, date: "Aug 28" },
  { name: "Step it up challenge", color: "#16a34a", amount: 10, date: "Aug 20" },
];

// === DOT SUB-VARIANTS ===
function DotFilled({ color }: { color: string }) {
  return <div className="absolute -left-[13px] top-0.5 w-4 h-4 rounded-full border-[3px] border-white" style={{ backgroundColor: color }} />;
}
function DotRing({ color }: { color: string }) {
  return <div className="absolute -left-[13px] top-0.5 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: color }} />;
}
function DotSmall({ color }: { color: string }) {
  return <div className="absolute -left-[11px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
}
const DOTS: Record<string, typeof DotFilled> = { filled: DotFilled, ring: DotRing, small: DotSmall };

// === AMOUNT SUB-VARIANTS ===
function AmountGreen({ amount, theme }: { amount: number; theme: TenantTheme }) {
  return <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: theme.successColor }}>+${amount}.00</span>;
}
function AmountBadge({ amount, theme }: { amount: number; theme: TenantTheme }) {
  return <span className="text-[10px] font-bold shrink-0 ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}>+${amount}</span>;
}
function AmountBold({ amount }: { amount: number; theme: TenantTheme }) {
  return <span className="text-xs font-bold text-gray-900 shrink-0 ml-2">+${amount}.00</span>;
}
const AMOUNTS: Record<string, typeof AmountGreen> = { green: AmountGreen, badge: AmountBadge, bold: AmountBold };

// === SUMMARY SUB-VARIANTS ===
function SummaryDefault() {
  return (
    <div className="flex items-center justify-between">
      <div><div className="text-[10px] text-gray-400">Actions</div><div className="text-lg font-bold text-gray-900">5</div></div>
      <div className="text-2xl font-bold text-gray-900">$50.00</div>
    </div>
  );
}
function SummaryCompact() {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">5 actions completed</span>
      <span className="font-bold text-gray-900">$50.00</span>
    </div>
  );
}
function SummaryHidden() { return null; }
const SUMMARIES: Record<string, () => React.ReactNode> = { default: SummaryDefault, compact: SummaryCompact, hidden: SummaryHidden };

// === MAIN ===
export default function RecentActivityVariantA({ props }: Props) {
  const theme = useTheme();
  const maxItems = (props.maxItems as number) ?? 5;
  const showViewAll = (props.showViewAll as boolean) ?? true;
  const dotStyle = (props.dotStyle as string) ?? "filled";
  const amountStyle = (props.amountStyle as string) ?? "green";
  const summaryStyle = (props.summaryStyle as string) ?? "default";

  const Dot = DOTS[dotStyle] ?? DotFilled;
  const Amount = AMOUNTS[amountStyle] ?? AmountGreen;
  const Summary = SUMMARIES[summaryStyle] ?? SummaryDefault;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
          <span className="text-sm font-semibold text-gray-900">Today, September 15, 2025</span>
        </div>
        {showViewAll && (
          <button className="flex items-center gap-0.5 text-xs font-medium" style={{ color: theme.linkColor }}>
            See more <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <div className="relative pl-5 border-l-2 border-gray-100 ml-1">
          {MILESTONES.slice(0, maxItems).map((item, i) => (
            <div key={i} className="relative pb-3 last:pb-0">
              <div data-sub-key={i === 0 ? "dot" : undefined} data-sub-label={i === 0 ? "Timeline Dot" : undefined}>
                <Dot color={item.color} />
              </div>
              <div className="pl-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-800 font-medium">{item.name}</div>
                  <div className="text-[10px] text-gray-400">{item.date}</div>
                </div>
                <div data-sub-key={i === 0 ? "amount" : undefined} data-sub-label={i === 0 ? "Amount" : undefined}>
                  <Amount amount={item.amount} theme={theme} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-3 shrink-0" data-sub-key="summary" data-sub-label="Summary">
        <Summary />
      </div>

      <div className="border-t border-gray-50 px-5 py-2 shrink-0">
        <button className="text-xs font-medium flex items-center gap-1" style={{ color: theme.linkColor }}>
          Recent activity <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
