import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function InfoCardVariantC({ props }: Props) {
  const theme = useTheme();
  const title = (props.title as string) ?? "Earn more by completing wellness actions!";
  const body = (props.body as string) ?? "Complete activities to earn rewards toward your wellness goals.";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-full">
      <div className="text-lg font-bold text-gray-900 mb-2">{title}</div>
      {body && <div className="text-sm text-gray-600 leading-relaxed">{body}</div>}
      <button
        className="mt-3 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}
      >
        Learn more
      </button>
    </div>
  );
}
