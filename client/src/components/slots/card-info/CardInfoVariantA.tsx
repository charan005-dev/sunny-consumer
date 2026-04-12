import { CreditCard } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function CardInfoVariantA({ props }: Props) {
  const theme = useTheme();
  const balance = (props.balance as number) ?? 10;
  const activeTab = (props.activeTab as string) ?? "transactions";

  const tabs = [
    { key: "transactions", label: "Essie Transactions" },
    { key: "rewards", label: "Rewards" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xl font-bold text-gray-900">My card</h3>
        <p className="text-sm text-gray-500 mt-0.5">Check out your balances and transactions below.</p>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-1 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className="px-3 py-2 text-xs font-medium rounded-t-lg transition-colors"
            style={tab.key === activeTab
              ? { backgroundColor: theme.primaryLight, color: theme.activeText }
              : { color: "#6b7280" }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Balance */}
      <div className="px-6 py-5 flex-1">
        <div className="text-xs text-gray-400 mb-1">Available to spend</div>
        <div className="text-4xl font-bold text-gray-900 mb-4">${balance.toFixed(2)}</div>
        <button
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: theme.primary }}
        >
          Activate card
        </button>
      </div>
    </div>
  );
}
