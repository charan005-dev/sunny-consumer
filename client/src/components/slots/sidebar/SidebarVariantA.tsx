import { CreditCard, ShoppingCart, Target, Heart, User, Bell, Settings, Lock, HelpCircle, FileText } from "lucide-react";
import type { ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "My card": CreditCard,
  "Shop": ShoppingCart,
  "My rewards": Target,
  "Health adventures": Heart,
  "Personal": User,
  "Notifications": Bell,
  "Manage card": Settings,
  "Security": Lock,
  "Help": HelpCircle,
};

const ROUTES: Record<string, string> = {
  "My card": "/my-card",
  "My rewards": "/rewards",
};

export default function SidebarVariantA({ props }: Props) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const items = (props.items as string[]) ?? ["My card", "Shop", "My rewards", "Health adventures", "Personal", "Notifications", "Manage card", "Security", "Help"];

  const isPreview = location.pathname.startsWith("/preview");

  // In preview mode, read route from URL params; in consumer app, use pathname
  const currentPath = isPreview
    ? new URLSearchParams(location.search).get("route") ?? "/rewards"
    : location.pathname;
  const activeItem = Object.entries(ROUTES).find(([, path]) => currentPath.startsWith(path))?.[0];

  return (
    <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <ul className="p-3 space-y-0.5 flex-1">
        {items.map((item) => {
          const Icon = ICONS[item] ?? FileText;
          const isActive = item === activeItem;
          const route = ROUTES[item];
          return (
            <li key={item}>
              <button
                onClick={() => {
                  if (!route || isPreview) return;
                  navigate(route);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors hover:bg-gray-50"
                style={isActive ? { backgroundColor: theme.activeBg, color: theme.activeText, fontWeight: 600 } : { color: "#374151" }}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="px-5 py-3 border-t border-gray-100 space-y-1.5">
        <a href="#" className="block text-xs text-gray-400 hover:text-gray-600">Agreements</a>
        <a href="#" className="block text-xs text-gray-400 hover:text-gray-600">Privacy policy</a>
        <a href="#" className="block text-xs text-gray-400 hover:text-gray-600">Home</a>
      </div>
      <div className="px-5 py-3 border-t border-gray-50">
        <span className="text-[10px] text-gray-300">Health Plan Inc.</span>
      </div>
    </nav>
  );
}
