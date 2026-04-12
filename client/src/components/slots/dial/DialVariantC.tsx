import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function DialVariantC({ props }: Props) {
  const theme = useTheme();
  const earned = (props.earned as number) ?? 75;
  const max = (props.max as number) ?? 150;
  const left = max - earned;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full flex flex-col text-center">
      <h3 className="text-base font-bold text-gray-900 mb-1">My rewards</h3>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-5xl font-bold text-gray-900">${left}</div>
        <div className="text-gray-400 text-sm mt-1">left to earn</div>
      </div>
      <div className="flex gap-4 pt-3 border-t border-gray-100 justify-center">
        <div>
          <div className="text-xl font-bold" style={{ color: theme.dialStroke }}>${earned}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Earned</div>
        </div>
        <div className="w-px bg-gray-100" />
        <div>
          <div className="text-xl font-bold text-gray-800">${max}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Maximum</div>
        </div>
      </div>
    </div>
  );
}
