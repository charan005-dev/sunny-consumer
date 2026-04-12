import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function DialVariantB({ props }: Props) {
  const theme = useTheme();
  const earned = (props.earned as number) ?? 75;
  const max = (props.max as number) ?? 150;
  const left = max - earned;
  const pct = Math.min((earned / max) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-1">
        <h3 className="text-base font-bold text-gray-900">My rewards</h3>
        <p className="text-[11px] text-gray-400">Track your earnings progress.</p>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-3">
          <span className="text-4xl font-bold text-gray-900">${left}</span>
          <span className="text-gray-400 ml-2 text-sm">left to earn</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: theme.dialStroke }} />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-gray-400"><span className="font-semibold text-gray-900">${earned}</span> Earned</span>
          <span className="text-gray-400">Max <span className="font-semibold text-gray-900">${max}</span></span>
        </div>
      </div>
    </div>
  );
}
