import { ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const TRANSACTIONS = [
  { name: "2026 Rewards", type: "Deposit", date: "Today, 10:30 AM", amount: "+$10.00", positive: true },
  { name: "Deposit", type: "Deposit", date: "Today, 10:30 AM", amount: "+$25.00", positive: true },
  { name: "Costco", type: "Purchase", date: "Today, 10:25 AM", amount: "-$15.00", positive: false },
  { name: "CVS Pharmacy", type: "Purchase", date: "Today, 10:24 AM", amount: "-$12.00", positive: false },
];

const RESTRICTIONS = [
  "No alcohol",
  "No tobacco",
  "No firearms",
];

export default function TransactionsVariantA({ props }: Props) {
  const theme = useTheme();
  const healthyLivingBalance = (props.healthyLivingBalance as number) ?? 10;
  const maxItems = (props.maxItems as number) ?? 4;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Healthy living header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Healthy living</h3>
        <span className="text-lg font-bold" style={{ color: theme.primary }}>${healthyLivingBalance.toFixed(2)}</span>
      </div>

      {/* Transaction list */}
      <div className="px-5 flex-1 overflow-y-auto">
        <div className="space-y-0">
          {TRANSACTIONS.slice(0, maxItems).map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tx.positive ? theme.primaryLight : "#fef2f2" }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.positive ? theme.primary : "#ef4444" }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{tx.name}</div>
                  <div className="text-xs text-gray-400">{tx.date}</div>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.positive ? "text-gray-900" : "text-gray-900"}`}>{tx.amount}</span>
            </div>
          ))}
        </div>

        {/* View all */}
        <button
          className="w-full py-3 mt-2 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: theme.primary }}
        >
          View all
        </button>
      </div>

      {/* Restrictions */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            Special restrictions
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <AlertCircle className="w-3 h-3" />
            Expires on March 31, 2027
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {RESTRICTIONS.map((r) => (
            <span key={r} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{r}</span>
          ))}
        </div>
        <button className="text-xs font-medium mt-2" style={{ color: theme.linkColor }}>
          Hide details
        </button>
      </div>
    </div>
  );
}
