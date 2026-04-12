import { Info, Trophy } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function InfoCardVariantA({ props }: Props) {
  const theme = useTheme();
  const title = (props.title as string) ?? "Your chance to win $100 each month";
  const entries = (props.entries as number) ?? 3;
  const nextDrawing = (props.nextDrawing as string) ?? "3/15/25";

  return (
    <div className="rounded-2xl p-5 text-white shadow-sm relative overflow-hidden h-full" style={{ backgroundColor: theme.cardBg }}>
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-white/10" />
      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full border border-white/10" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 opacity-70" />
            <span className="text-sm font-medium opacity-90">{title}</span>
          </div>
          <button className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors">
            <Info className="w-3 h-3" />
          </button>
        </div>
        <div className="text-3xl font-bold mb-1">{entries} Entries earned</div>
        <div className="text-sm opacity-60">Next drawing {nextDrawing}</div>
        <div className="flex gap-1.5 mt-4">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
