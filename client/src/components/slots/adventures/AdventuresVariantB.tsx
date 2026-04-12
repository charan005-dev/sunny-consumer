import { ChevronRight } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const ADVENTURES = [
  { name: "Fitness and exercise", desc: "Get moving with guided workouts", color: "#16a34a" },
  { name: "Self-care and wellness", desc: "Mindfulness and relaxation", color: "#2563eb" },
  { name: "Healthy eating", desc: "Nutrition tips and meal plans", color: "#d97706" },
  { name: "Sleep better challenge", desc: "Improve your sleep habits", color: "#7c3aed" },
  { name: "Hydration tracker", desc: "Track daily water intake", color: "#0891b2" },
  { name: "Mindfulness journey", desc: "Guided meditation series", color: "#be185d" },
];

export default function AdventuresVariantB({ props }: Props) {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bold text-gray-900">For you</h3>
        <button className="flex items-center gap-0.5 text-sm font-medium" style={{ color: theme.linkColor }}>
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-5 pb-5 space-y-2">
        {ADVENTURES.map((adv) => (
          <div
            key={adv.name}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center" style={{ backgroundColor: adv.color + "15" }}>
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: adv.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{adv.name}</div>
              <div className="text-xs text-gray-400">{adv.desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
