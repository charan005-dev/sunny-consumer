import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function InfoCardVariantB({ props }: Props) {
  const theme = useTheme();
  const title = (props.title as string) ?? "Your chance to win $100 each month";

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm relative h-40" style={{ background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})` }}>
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/10" />
      <div className="absolute bottom-6 right-8 w-12 h-12 rounded-full border-2 border-white/10" />
      <div className="relative p-5 text-white flex flex-col justify-end h-full">
        <div className="text-lg font-bold leading-snug">{title}</div>
        <div className="text-sm opacity-70 mt-1">Tap to learn more</div>
      </div>
    </div>
  );
}
