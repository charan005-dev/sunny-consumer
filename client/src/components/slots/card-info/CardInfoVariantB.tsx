import { Wallet } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function CardInfoVariantB({ props }: Props) {
  const theme = useTheme();
  const balance = (props.balance as number) ?? 10;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xl font-bold text-gray-900">My card</h3>
        <p className="text-sm text-gray-500 mt-0.5">Manage your card and view spending.</p>
      </div>

      {/* Card visual */}
      <div className="px-6 py-4 flex-1">
        <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ backgroundColor: theme.cardBg }}>
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border border-white/10" />
          <div className="relative">
            <Wallet className="w-8 h-8 mb-4 opacity-80" />
            <div className="text-xs opacity-60 mb-1">Available balance</div>
            <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
          </div>
        </div>
        <button
          className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: theme.primary }}
        >
          Activate card
        </button>
      </div>
    </div>
  );
}
