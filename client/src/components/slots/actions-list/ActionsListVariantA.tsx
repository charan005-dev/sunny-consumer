import { ChevronRight, SlidersHorizontal, Ticket } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const SAMPLE_ACTIONS = [
  { name: "Complete the total health assessment", reward: 20, desc: "Answer questions about your health", hasEntries: false },
  { name: "Take a stroll after a meal", reward: 10, desc: "Walk 15 minutes after eating", hasEntries: false },
  { name: "Meditate to boost your wellness", reward: 5, desc: "10 min guided meditation", hasEntries: false },
  { name: "Play health trivia", reward: 5, desc: "Test your wellness knowledge", hasEntries: true },
  { name: "Get your flu vaccine", reward: 20, desc: "Upload proof of vaccination", hasEntries: false },
  { name: "Start your wellness coaching", reward: 20, desc: "Schedule your first session", hasEntries: false },
  { name: "Rethink your drink", reward: 10, desc: "Track your hydration for a week", hasEntries: false },
  { name: "Get your z's", reward: 10, desc: "Log 7 hours of sleep for 5 days", hasEntries: false },
  { name: "Eat well to fuel your body", reward: 10, desc: "Complete a nutrition course", hasEntries: true },
];

export default function ActionsListVariantA({ props: _props }: Props) {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header with filter */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bold text-gray-900">Actions for you</h3>
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
          High to low
          <SlidersHorizontal className="w-3 h-3" />
        </button>
      </div>

      {/* Action cards */}
      <div className="px-3 pb-3 space-y-2 flex-1 overflow-y-auto">
        {SAMPLE_ACTIONS.map((action) => (
          <div
            key={action.name}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            {/* Dollar badge */}
            <div
              className="text-sm font-bold rounded-2xl w-14 h-14 flex items-center justify-center shrink-0"
              style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
            >
              ${action.reward}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm leading-snug">{action.name}</div>
              {action.hasEntries && (
                <div className="flex items-center gap-1 mt-1">
                  <Ticket className="w-3 h-3" style={{ color: theme.primary }} />
                  <span className="text-xs font-medium" style={{ color: theme.primary }}>Entries</span>
                </div>
              )}
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
