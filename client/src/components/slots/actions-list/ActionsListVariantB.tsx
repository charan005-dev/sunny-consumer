import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const SAMPLE_ACTIONS = [
  { name: "Complete the Total Health Assessment", reward: 20, status: "Available" },
  { name: "Take a stroll after a meal", reward: 10, status: "In progress" },
  { name: "Meditate to boost your wellness", reward: 5, status: "Available" },
  { name: "Get your flu vaccine", reward: 20, status: "Complete" },
  { name: "Play health trivia", reward: 5, status: "In progress" },
  { name: "Start your wellness coaching", reward: 20, status: "Available" },
];

export default function ActionsListVariantB({ props }: Props) {
  const theme = useTheme();
  const columns = (props.columns as number) ?? 2;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <h3 className="font-bold text-gray-900 mb-4">Actions for you</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {SAMPLE_ACTIONS.map((action) => (
          <div
            key={action.name}
            className="rounded-xl p-3.5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <div
              className="text-xs font-bold rounded-lg w-10 h-10 flex items-center justify-center mb-2.5"
              style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
            >
              ${action.reward}
            </div>
            <div className="font-medium text-gray-900 text-sm leading-snug mb-1">{action.name}</div>
            <div className={`text-xs ${
              action.status === "Complete" ? "text-green-600" :
              action.status === "In progress" ? "text-blue-600" : "text-gray-400"
            }`}>
              {action.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
