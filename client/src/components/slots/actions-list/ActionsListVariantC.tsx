import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const SAMPLE_ACTIONS = [
  { name: "Complete the Total Health Assessment", reward: 20, status: "Available" },
  { name: "Take a stroll after a meal", reward: 10, status: "In progress" },
  { name: "Meditate to boost your wellness", reward: 5, status: "Available" },
  { name: "Play health trivia", reward: 5, status: "In progress" },
  { name: "Get your flu vaccine", reward: 20, status: "Complete" },
];

export default function ActionsListVariantC({ props }: Props) {
  const theme = useTheme();
  const cardWidth = (props.cardWidth as number) ?? 200;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full overflow-hidden">
      <h3 className="font-bold text-gray-900 mb-4">Actions for you</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2 w-max">
          {SAMPLE_ACTIONS.map((action) => (
            <div
              key={action.name}
              className="rounded-xl p-4 border border-gray-100 shrink-0 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
              style={{ width: cardWidth }}
            >
              <div
                className="text-sm font-bold rounded-lg w-12 h-12 flex items-center justify-center mb-3"
                style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
              >
                ${action.reward}
              </div>
              <div className="font-medium text-gray-900 text-sm mb-1 leading-snug">{action.name}</div>
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
    </div>
  );
}
