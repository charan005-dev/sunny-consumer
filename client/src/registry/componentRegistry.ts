import { lazy } from "react";
import type { ComponentType } from "react";

export interface SlotComponentProps {
  props: Record<string, unknown>;
}

export interface RegistryEntry {
  component: ComponentType<SlotComponentProps>;
  slotType: string;
  name: string;
}

const registry: Record<string, RegistryEntry> = {
  dial_variant_a: {
    component: lazy(() => import("../components/slots/dial/DialVariantA")),
    slotType: "dial",
    name: "Gauge Dial",
  },
  dial_variant_b: {
    component: lazy(() => import("../components/slots/dial/DialVariantB")),
    slotType: "dial",
    name: "Progress Bar",
  },
  dial_variant_c: {
    component: lazy(() => import("../components/slots/dial/DialVariantC")),
    slotType: "dial",
    name: "Numeric Display",
  },
  info_card_variant_a: {
    component: lazy(() => import("../components/slots/info-card/InfoCardVariantA")),
    slotType: "info_card",
    name: "Blue Promo Card",
  },
  info_card_variant_b: {
    component: lazy(() => import("../components/slots/info-card/InfoCardVariantB")),
    slotType: "info_card",
    name: "Image Promo Card",
  },
  info_card_variant_c: {
    component: lazy(() => import("../components/slots/info-card/InfoCardVariantC")),
    slotType: "info_card",
    name: "Text-Only Card",
  },
  actions_list_variant_a: {
    component: lazy(() => import("../components/slots/actions-list/ActionsListVariantA")),
    slotType: "actions_list",
    name: "Vertical Actions List",
  },
  actions_list_variant_b: {
    component: lazy(() => import("../components/slots/actions-list/ActionsListVariantB")),
    slotType: "actions_list",
    name: "Card Grid Actions",
  },
  actions_list_variant_c: {
    component: lazy(() => import("../components/slots/actions-list/ActionsListVariantC")),
    slotType: "actions_list",
    name: "Horizontal Scroll Actions",
  },
  recent_activity_variant_a: {
    component: lazy(() => import("../components/slots/recent-activity/RecentActivityVariantA")),
    slotType: "recent_activity",
    name: "Activity Table",
  },
  recent_activity_variant_b: {
    component: lazy(() => import("../components/slots/recent-activity/RecentActivityVariantB")),
    slotType: "recent_activity",
    name: "Activity Timeline",
  },
  recent_activity_variant_c: {
    component: lazy(() => import("../components/slots/recent-activity/RecentActivityVariantC")),
    slotType: "recent_activity",
    name: "Compact Activity",
  },
  sidebar_variant_a: {
    component: lazy(() => import("../components/slots/sidebar/SidebarVariantA")),
    slotType: "sidebar",
    name: "Full Sidebar",
  },
  sidebar_variant_b: {
    component: lazy(() => import("../components/slots/sidebar/SidebarVariantB")),
    slotType: "sidebar",
    name: "Icon-Only Sidebar",
  },
  sidebar_variant_c: {
    component: lazy(() => import("../components/slots/sidebar/SidebarVariantC")),
    slotType: "sidebar",
    name: "Bottom Navigation",
  },
  // Card info variants
  card_info_variant_a: {
    component: lazy(() => import("../components/slots/card-info/CardInfoVariantA")),
    slotType: "card_info",
    name: "Card Balance Tabs",
  },
  card_info_variant_b: {
    component: lazy(() => import("../components/slots/card-info/CardInfoVariantB")),
    slotType: "card_info",
    name: "Card Visual",
  },
  // Transactions variants
  transactions_variant_a: {
    component: lazy(() => import("../components/slots/transactions/TransactionsVariantA")),
    slotType: "transactions",
    name: "Healthy Living List",
  },
  transactions_variant_b: {
    component: lazy(() => import("../components/slots/transactions/TransactionsVariantB")),
    slotType: "transactions",
    name: "Simple Transactions",
  },
  // Adventures variants
  adventures_variant_a: {
    component: lazy(() => import("../components/slots/adventures/AdventuresVariantA")),
    slotType: "adventures",
    name: "Horizontal Cards",
  },
  adventures_variant_b: {
    component: lazy(() => import("../components/slots/adventures/AdventuresVariantB")),
    slotType: "adventures",
    name: "Vertical List",
  },
  // Streak calendar variants
  streak_calendar_variant_a: {
    component: lazy(() => import("../components/slots/streak-calendar/StreakCalendarVariantA")),
    slotType: "streak_calendar",
    name: "Monthly Grid",
  },
  streak_calendar_variant_b: {
    component: lazy(() => import("../components/slots/streak-calendar/StreakCalendarVariantB")),
    slotType: "streak_calendar",
    name: "Weekly Circles",
  },
  streak_calendar_variant_c: {
    component: lazy(() => import("../components/slots/streak-calendar/StreakCalendarVariantC")),
    slotType: "streak_calendar",
    name: "Activity Chart",
  },
};

export function getComponent(code: string): RegistryEntry | undefined {
  return registry[code];
}

export function getComponentsBySlotType(slotType: string): RegistryEntry[] {
  return Object.entries(registry)
    .filter(([, entry]) => entry.slotType === slotType)
    .map(([, entry]) => entry);
}

export default registry;
