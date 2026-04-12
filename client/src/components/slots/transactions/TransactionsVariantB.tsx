import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const TRANSACTIONS = [
  { name: "2026 Rewards", date: "Today", amount: "+$10.00", positive: true },
  { name: "Deposit", date: "Today", amount: "+$25.00", positive: true },
  { name: "Costco", date: "Today", amount: "-$15.00", positive: false },
  { name: "CVS Pharmacy", date: "Today", amount: "-$12.00", positive: false },
];

export default function TransactionsVariantB({ props }: Props) {
  const theme = useTheme();
  const healthyLivingBalance = (props.healthyLivingBalance as number) ?? 10;
  const maxItems = (props.maxItems as number) ?? 4;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-bold text-gray-900">Transactions</h3>
        <div className="text-2xl font-bold mt-1" style={{ color: theme.primary }}>${healthyLivingBalance.toFixed(2)}</div>
      </div>

      <div className="px-5 flex-1 overflow-y-auto space-y-2 pb-4">
        {TRANSACTIONS.slice(0, maxItems).map((tx, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <div className="text-sm font-medium text-gray-900">{tx.name}</div>
              <div className="text-xs text-gray-400">{tx.date}</div>
            </div>
            <span className={`text-sm font-bold ${tx.positive ? "text-green-600" : "text-red-500"}`}>{tx.amount}</span>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}>
          View all transactions
        </button>
      </div>
    </div>
  );
}
