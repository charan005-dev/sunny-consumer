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

export default function SidebarVariantB({ props }: Props) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const items = (props.items as string[]) ?? ["My card", "Shop", "My rewards", "Health adventures"];

  const isPreview = location.pathname.startsWith("/preview");
  const currentPath = isPreview
    ? new URLSearchParams(location.search).get("route") ?? "/rewards"
    : location.pathname;
  const activeItem = Object.entries(ROUTES).find(([, path]) => currentPath.startsWith(path))?.[0];

  return (
    <nav className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex flex-col items-center">
      <ul className="space-y-1.5">
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
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                style={isActive ? { backgroundColor: theme.activeBg } : {}}
                title={item}
              >
                <Icon className="w-5 h-5" style={isActive ? { color: theme.activeText } : { color: "#6b7280" }} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
