import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Tenants ---
  const kaiser = await prisma.tenant.upsert({
    where: { code: "kaiser" },
    update: {},
    create: { code: "kaiser", name: "Kaiser" },
  });
  const sunny = await prisma.tenant.upsert({
    where: { code: "sunny" },
    update: {},
    create: { code: "sunny", name: "Sunny" },
  });
  console.log("  Tenants:", kaiser.name, sunny.name);

  // --- Cohorts ---
  const kaiserDefault = await prisma.cohort.upsert({
    where: { tenantId_code: { tenantId: kaiser.id, code: "default" } },
    update: {},
    create: { code: "default", name: "Default", tenantId: kaiser.id },
  });
  await prisma.cohort.upsert({
    where: { tenantId_code: { tenantId: kaiser.id, code: "genz" } },
    update: {},
    create: { code: "genz", name: "Gen Z", tenantId: kaiser.id },
  });
  await prisma.cohort.upsert({
    where: { tenantId_code: { tenantId: kaiser.id, code: "millennial" } },
    update: {},
    create: { code: "millennial", name: "Millennial", tenantId: kaiser.id },
  });
  const sunnyDefault = await prisma.cohort.upsert({
    where: { tenantId_code: { tenantId: sunny.id, code: "default" } },
    update: {},
    create: { code: "default", name: "Default", tenantId: sunny.id },
  });
  await prisma.cohort.upsert({
    where: { tenantId_code: { tenantId: sunny.id, code: "genz" } },
    update: {},
    create: { code: "genz", name: "Gen Z", tenantId: sunny.id },
  });
  await prisma.cohort.upsert({
    where: { tenantId_code: { tenantId: sunny.id, code: "millennial" } },
    update: {},
    create: { code: "millennial", name: "Millennial", tenantId: sunny.id },
  });
  console.log("  Cohorts: 8");

  // --- Route ---
  const rewardsRoute = await prisma.route.upsert({
    where: { path: "/rewards" },
    update: {},
    create: { path: "/rewards", name: "My Rewards", description: "Rewards dashboard page" },
  });
  const myCardRoute = await prisma.route.upsert({
    where: { path: "/my-card" },
    update: {},
    create: { path: "/my-card", name: "My Card", description: "Card balance and transactions page" },
  });
  const dashboardRoute = await prisma.route.upsert({
    where: { path: "/dashboard" },
    update: {},
    create: { path: "/dashboard", name: "Dashboard", description: "Main dashboard page" },
  });
  console.log("  Routes:", rewardsRoute.path, myCardRoute.path, dashboardRoute.path);

  // --- Slot Definitions (arrays stored as JSON strings in SQLite) ---
  const slotDefs = [
    { slotKey: "sidebar", name: "Sidebar Navigation", allowedSlotTypes: JSON.stringify(["sidebar"]), sortOrder: 0, viewports: JSON.stringify(["desktop"]) },
    { slotKey: "dial", name: "Rewards Dial", allowedSlotTypes: JSON.stringify(["dial"]), sortOrder: 1, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "info_card", name: "Info Card", allowedSlotTypes: JSON.stringify(["info_card"]), sortOrder: 2, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "actions_list", name: "Actions List", allowedSlotTypes: JSON.stringify(["actions_list"]), sortOrder: 3, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "streak_calendar", name: "Streak Calendar", allowedSlotTypes: JSON.stringify(["streak_calendar"]), sortOrder: 4, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "recent_activity", name: "Recent Activity", allowedSlotTypes: JSON.stringify(["recent_activity"]), sortOrder: 5, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "bottom_nav", name: "Bottom Navigation", allowedSlotTypes: JSON.stringify(["sidebar"]), sortOrder: 6, viewports: JSON.stringify(["mobile"]) },
  ];

  for (const sd of slotDefs) {
    await prisma.slotDefinition.upsert({
      where: { routeId_slotKey: { routeId: rewardsRoute.id, slotKey: sd.slotKey } },
      update: {},
      create: { ...sd, routeId: rewardsRoute.id },
    });
  }
  console.log("  Slot definitions (rewards):", slotDefs.length);

  // --- Slot Definitions for /my-card ---
  const cardSlotDefs = [
    { slotKey: "sidebar", name: "Sidebar Navigation", allowedSlotTypes: JSON.stringify(["sidebar"]), sortOrder: 0, viewports: JSON.stringify(["desktop"]) },
    { slotKey: "card_info", name: "Card Info", allowedSlotTypes: JSON.stringify(["card_info"]), sortOrder: 1, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "transactions", name: "Transactions", allowedSlotTypes: JSON.stringify(["transactions"]), sortOrder: 2, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "adventures", name: "Adventures", allowedSlotTypes: JSON.stringify(["adventures"]), sortOrder: 3, viewports: JSON.stringify(["desktop", "mobile"]) },
    { slotKey: "bottom_nav", name: "Bottom Navigation", allowedSlotTypes: JSON.stringify(["sidebar"]), sortOrder: 4, viewports: JSON.stringify(["mobile"]) },
  ];

  for (const sd of cardSlotDefs) {
    await prisma.slotDefinition.upsert({
      where: { routeId_slotKey: { routeId: myCardRoute.id, slotKey: sd.slotKey } },
      update: {},
      create: { ...sd, routeId: myCardRoute.id },
    });
  }
  console.log("  Slot definitions (my-card):", cardSlotDefs.length);

  // --- Component Registry (JSON fields stored as strings) ---
  const components = [
    { code: "dial_variant_a", name: "Gauge Dial", slotType: "dial", description: "Arc gauge showing earned vs max rewards", defaultProps: JSON.stringify({ earned: 10, max: 150 }) },
    { code: "dial_variant_b", name: "Progress Bar", slotType: "dial", description: "Horizontal progress bar showing rewards progress", defaultProps: JSON.stringify({ earned: 10, max: 150 }) },
    { code: "dial_variant_c", name: "Numeric Display", slotType: "dial", description: "Large numeric display of rewards balance", defaultProps: JSON.stringify({ earned: 10, max: 150 }) },
    { code: "info_card_variant_a", name: "Blue Promo Card", slotType: "info_card", description: "Blue card with sweepstakes/promo info and entry count", defaultProps: JSON.stringify({ title: "Your chance to win $100 each month", entries: 0, nextDrawing: "3/15/25" }) },
    { code: "info_card_variant_b", name: "Image Promo Card", slotType: "info_card", description: "Card with background image and promo text", defaultProps: JSON.stringify({ title: "Your chance to win $100 each month", imageUrl: "" }) },
    { code: "info_card_variant_c", name: "Text-Only Card", slotType: "info_card", description: "Simple text card with promo information", defaultProps: JSON.stringify({ title: "Your chance to win $100 each month", body: "" }) },
    { code: "actions_list_variant_a", name: "Vertical Actions List", slotType: "actions_list", description: "Vertical list showing reward actions with dollar amounts", defaultProps: JSON.stringify({ showCategories: true }) },
    { code: "actions_list_variant_b", name: "Card Grid Actions", slotType: "actions_list", description: "Grid of action cards with reward amounts", defaultProps: JSON.stringify({ columns: 2 }) },
    { code: "actions_list_variant_c", name: "Horizontal Scroll Actions", slotType: "actions_list", description: "Horizontally scrolling action cards", defaultProps: JSON.stringify({ cardWidth: 200 }) },
    { code: "recent_activity_variant_a", name: "Activity Table", slotType: "recent_activity", description: "Table view of recent reward activities", defaultProps: JSON.stringify({ maxItems: 5, showViewAll: true }) },
    { code: "recent_activity_variant_b", name: "Activity Timeline", slotType: "recent_activity", description: "Timeline view of recent activities", defaultProps: JSON.stringify({ maxItems: 5 }) },
    { code: "recent_activity_variant_c", name: "Compact Activity", slotType: "recent_activity", description: "Compact list of recent activities", defaultProps: JSON.stringify({ maxItems: 3 }) },
    { code: "sidebar_variant_a", name: "Full Sidebar", slotType: "sidebar", description: "Full left navigation sidebar with icons and labels", defaultProps: JSON.stringify({ items: ["My card", "Shop", "My rewards", "Health adventures", "Personal", "Notifications", "Manage card", "Security", "Help"] }) },
    { code: "sidebar_variant_b", name: "Icon-Only Sidebar", slotType: "sidebar", description: "Compact icon-only navigation sidebar", defaultProps: JSON.stringify({ items: ["My card", "Shop", "My rewards", "Health adventures"] }) },
    { code: "sidebar_variant_c", name: "Bottom Navigation", slotType: "sidebar", description: "Bottom tab navigation for mobile", defaultProps: JSON.stringify({ items: ["My rewards", "Health adventures"] }) },
    // Card info
    { code: "card_info_variant_a", name: "Card Balance Tabs", slotType: "card_info", description: "Card balance with transaction/rewards tabs and activate button", defaultProps: JSON.stringify({ balance: 10, activeTab: "transactions" }) },
    { code: "card_info_variant_b", name: "Card Visual", slotType: "card_info", description: "Visual card design with balance display", defaultProps: JSON.stringify({ balance: 10 }) },
    // Transactions
    { code: "transactions_variant_a", name: "Healthy Living List", slotType: "transactions", description: "Transaction list with healthy living balance and restrictions", defaultProps: JSON.stringify({ healthyLivingBalance: 10, maxItems: 4 }) },
    { code: "transactions_variant_b", name: "Simple Transactions", slotType: "transactions", description: "Clean transaction list with totals", defaultProps: JSON.stringify({ healthyLivingBalance: 10, maxItems: 4 }) },
    // Adventures
    { code: "adventures_variant_a", name: "Horizontal Cards", slotType: "adventures", description: "Horizontally scrolling adventure cards with images", defaultProps: JSON.stringify({ cardWidth: 220 }) },
    { code: "adventures_variant_b", name: "Vertical List", slotType: "adventures", description: "Vertical list of adventure recommendations", defaultProps: JSON.stringify({}) },
    // Streak calendar
    { code: "streak_calendar_variant_a", name: "Monthly Grid", slotType: "streak_calendar", description: "Monthly calendar grid with flame icons for completed days", defaultProps: JSON.stringify({ streak: 5, completedDays: [0, 1, 2, 3, 4, 7, 8, 9, 10, 14, 15, 16, 17, 18] }) },
    { code: "streak_calendar_variant_b", name: "Weekly Circles", slotType: "streak_calendar", description: "Weekly view with circular checkmarks and progress bar", defaultProps: JSON.stringify({ streak: 5, completedDays: [0, 1, 2, 3, 4] }) },
    { code: "streak_calendar_variant_c", name: "Activity Chart", slotType: "streak_calendar", description: "Monthly bar chart showing activity trends", defaultProps: JSON.stringify({ streak: 5, monthlyData: [12, 18, 8, 22, 15, 20] }) },
  ];

  for (const comp of components) {
    await prisma.componentRegistryEntry.upsert({
      where: { code: comp.code },
      update: {},
      create: comp,
    });
  }
  console.log("  Components:", components.length);

  // --- Sample Published Layouts (layoutJson stored as JSON string) ---
  const kaiserDesktopLayout = {
    routePath: "/rewards",
    viewport: "desktop",
    gridTemplate: {
      columns: "240px 1fr 340px",
      rows: "200px 180px 280px 300px",
      gap: "16px",
      areas: [
        "sidebar dial actions",
        "sidebar info_card actions",
        "sidebar streak_calendar actions",
        "sidebar recent_activity recent_activity",
      ],
    },
    slots: {
      sidebar: { componentCode: "sidebar_variant_a", gridArea: "sidebar", props: { items: ["My card", "Shop", "My rewards", "Health adventures", "Personal", "Notifications", "Manage card", "Security", "Help"] } },
      dial: { componentCode: "dial_variant_a", gridArea: "dial", props: { earned: 75, max: 150 } },
      info_card: { componentCode: "info_card_variant_a", gridArea: "info_card", props: { title: "Your chance to win $100 each month", entries: 3, nextDrawing: "3/15/25" } },
      streak_calendar: { componentCode: "streak_calendar_variant_a", gridArea: "streak_calendar", props: { streak: 5, completedDays: [0, 1, 2, 3, 4, 7, 8, 9, 10, 14, 15, 16, 17, 18] } },
      actions_list: { componentCode: "actions_list_variant_a", gridArea: "actions", props: { showCategories: true } },
      recent_activity: { componentCode: "recent_activity_variant_a", gridArea: "recent_activity", props: { maxItems: 5, showViewAll: true } },
    },
  };

  const kaiserMobileLayout = {
    routePath: "/rewards",
    viewport: "mobile",
    gridTemplate: {
      columns: "1fr",
      rows: "auto auto auto auto auto auto",
      gap: "16px",
      areas: ["dial", "info_card", "streak_calendar", "actions", "recent_activity", "bottom_nav"],
    },
    slots: {
      dial: { componentCode: "dial_variant_a", gridArea: "dial", props: { earned: 10, max: 150 } },
      info_card: { componentCode: "info_card_variant_a", gridArea: "info_card", props: { title: "Your chance to win $100 each month", entries: 0, nextDrawing: "3/15/25" } },
      streak_calendar: { componentCode: "streak_calendar_variant_b", gridArea: "streak_calendar", props: { streak: 5, completedDays: [0, 1, 2, 3, 4] } },
      actions_list: { componentCode: "actions_list_variant_a", gridArea: "actions", props: { showCategories: true } },
      recent_activity: { componentCode: "recent_activity_variant_a", gridArea: "recent_activity", props: { maxItems: 5, showViewAll: true } },
      bottom_nav: { componentCode: "sidebar_variant_c", gridArea: "bottom_nav", props: { items: ["My rewards", "Health adventures"] } },
    },
  };

  const sunnyDesktopLayout = {
    routePath: "/rewards",
    viewport: "desktop",
    gridTemplate: {
      columns: "240px 1fr 340px",
      rows: "200px 180px 280px 300px",
      gap: "16px",
      areas: [
        "sidebar dial actions",
        "sidebar info_card actions",
        "sidebar streak_calendar actions",
        "sidebar recent_activity recent_activity",
      ],
    },
    slots: {
      sidebar: { componentCode: "sidebar_variant_b", gridArea: "sidebar", props: { items: ["My card", "Shop", "My rewards", "Health adventures"] } },
      dial: { componentCode: "dial_variant_b", gridArea: "dial", props: { earned: 45, max: 200 } },
      info_card: { componentCode: "info_card_variant_c", gridArea: "info_card", props: { title: "Earn more by completing wellness actions!", body: "Complete activities to earn rewards" } },
      streak_calendar: { componentCode: "streak_calendar_variant_c", gridArea: "streak_calendar", props: { streak: 5, monthlyData: [12, 18, 8, 22, 15, 20] } },
      actions_list: { componentCode: "actions_list_variant_b", gridArea: "actions", props: { columns: 2 } },
      recent_activity: { componentCode: "recent_activity_variant_b", gridArea: "recent_activity", props: { maxItems: 5 } },
    },
  };

  const sunnyMobileLayout = {
    routePath: "/rewards",
    viewport: "mobile",
    gridTemplate: {
      columns: "1fr",
      rows: "auto auto auto auto auto auto",
      gap: "16px",
      areas: ["dial", "info_card", "streak_calendar", "actions", "recent_activity", "bottom_nav"],
    },
    slots: {
      dial: { componentCode: "dial_variant_c", gridArea: "dial", props: { earned: 45, max: 200 } },
      info_card: { componentCode: "info_card_variant_c", gridArea: "info_card", props: { title: "Earn more by completing wellness actions!", body: "" } },
      streak_calendar: { componentCode: "streak_calendar_variant_b", gridArea: "streak_calendar", props: { streak: 5, completedDays: [0, 1, 2, 3, 4] } },
      actions_list: { componentCode: "actions_list_variant_c", gridArea: "actions", props: { cardWidth: 160 } },
      recent_activity: { componentCode: "recent_activity_variant_c", gridArea: "recent_activity", props: { maxItems: 3 } },
      bottom_nav: { componentCode: "sidebar_variant_c", gridArea: "bottom_nav", props: { items: ["My rewards", "Health adventures"] } },
    },
  };

  // === /my-card layouts (same grid for both tenants, different variants) ===
  const myCardGrid = {
    columns: "240px 1fr 340px",
    rows: "380px 180px 200px",
    gap: "16px",
    areas: [
      "sidebar card_info transactions",
      "sidebar card_info transactions",
      "sidebar adventures adventures",
    ],
  };

  const myCardMobileGrid = {
    columns: "1fr",
    rows: "auto auto auto auto",
    gap: "16px",
    areas: ["card_info", "transactions", "adventures", "bottom_nav"],
  };

  const kaiserMyCardDesktop = {
    routePath: "/my-card",
    viewport: "desktop",
    gridTemplate: myCardGrid,
    slots: {
      sidebar: { componentCode: "sidebar_variant_a", gridArea: "sidebar", props: { items: ["My card", "Shop", "My rewards", "Health adventures", "Personal", "Notifications", "Manage card", "Security", "Help"] } },
      card_info: { componentCode: "card_info_variant_a", gridArea: "card_info", props: { balance: 10, activeTab: "transactions" } },
      transactions: { componentCode: "transactions_variant_a", gridArea: "transactions", props: { healthyLivingBalance: 10, maxItems: 4 } },
      adventures: { componentCode: "adventures_variant_a", gridArea: "adventures", props: { cardWidth: 220 } },
    },
  };

  const kaiserMyCardMobile = {
    routePath: "/my-card",
    viewport: "mobile",
    gridTemplate: myCardMobileGrid,
    slots: {
      card_info: { componentCode: "card_info_variant_a", gridArea: "card_info", props: { balance: 10, activeTab: "transactions" } },
      transactions: { componentCode: "transactions_variant_a", gridArea: "transactions", props: { healthyLivingBalance: 10, maxItems: 4 } },
      adventures: { componentCode: "adventures_variant_b", gridArea: "adventures", props: {} },
      bottom_nav: { componentCode: "sidebar_variant_c", gridArea: "bottom_nav", props: { items: ["My card", "My rewards"] } },
    },
  };

  const sunnyMyCardDesktop = {
    routePath: "/my-card",
    viewport: "desktop",
    gridTemplate: myCardGrid,
    slots: {
      sidebar: { componentCode: "sidebar_variant_b", gridArea: "sidebar", props: { items: ["My card", "Shop", "My rewards", "Health adventures"] } },
      card_info: { componentCode: "card_info_variant_b", gridArea: "card_info", props: { balance: 10 } },
      transactions: { componentCode: "transactions_variant_b", gridArea: "transactions", props: { healthyLivingBalance: 10, maxItems: 4 } },
      adventures: { componentCode: "adventures_variant_b", gridArea: "adventures", props: {} },
    },
  };

  const sunnyMyCardMobile = {
    routePath: "/my-card",
    viewport: "mobile",
    gridTemplate: myCardMobileGrid,
    slots: {
      card_info: { componentCode: "card_info_variant_b", gridArea: "card_info", props: { balance: 10 } },
      transactions: { componentCode: "transactions_variant_b", gridArea: "transactions", props: { healthyLivingBalance: 10, maxItems: 4 } },
      adventures: { componentCode: "adventures_variant_b", gridArea: "adventures", props: {} },
      bottom_nav: { componentCode: "sidebar_variant_c", gridArea: "bottom_nav", props: { items: ["My card", "My rewards"] } },
    },
  };

  const layoutConfigs = [
    { tenantId: kaiser.id, cohortId: kaiserDefault.id, viewport: "desktop", layoutJson: JSON.stringify(kaiserDesktopLayout) },
    { tenantId: kaiser.id, cohortId: kaiserDefault.id, viewport: "mobile", layoutJson: JSON.stringify(kaiserMobileLayout) },
    { tenantId: sunny.id, cohortId: sunnyDefault.id, viewport: "desktop", layoutJson: JSON.stringify(sunnyDesktopLayout) },
    { tenantId: sunny.id, cohortId: sunnyDefault.id, viewport: "mobile", layoutJson: JSON.stringify(sunnyMobileLayout) },
  ];

  const myCardLayoutConfigs = [
    { tenantId: kaiser.id, cohortId: kaiserDefault.id, viewport: "desktop", layoutJson: JSON.stringify(kaiserMyCardDesktop) },
    { tenantId: kaiser.id, cohortId: kaiserDefault.id, viewport: "mobile", layoutJson: JSON.stringify(kaiserMyCardMobile) },
    { tenantId: sunny.id, cohortId: sunnyDefault.id, viewport: "desktop", layoutJson: JSON.stringify(sunnyMyCardDesktop) },
    { tenantId: sunny.id, cohortId: sunnyDefault.id, viewport: "mobile", layoutJson: JSON.stringify(sunnyMyCardMobile) },
  ];

  for (const lc of layoutConfigs) {
    await prisma.pageLayout.upsert({
      where: {
        routeId_tenantId_cohortId_viewport_status: {
          routeId: rewardsRoute.id,
          tenantId: lc.tenantId,
          cohortId: lc.cohortId,
          viewport: lc.viewport,
          status: "published",
        },
      },
      update: { layoutJson: lc.layoutJson },
      create: {
        routeId: rewardsRoute.id,
        ...lc,
        status: "published",
        version: 1,
        publishedAt: new Date(),
        publishedBy: "seed",
      },
    });

    await prisma.pageLayout.upsert({
      where: {
        routeId_tenantId_cohortId_viewport_status: {
          routeId: rewardsRoute.id,
          tenantId: lc.tenantId,
          cohortId: lc.cohortId,
          viewport: lc.viewport,
          status: "draft",
        },
      },
      update: { layoutJson: lc.layoutJson },
      create: {
        routeId: rewardsRoute.id,
        ...lc,
        status: "draft",
        version: 1,
      },
    });
  }
  console.log("  Layouts (rewards): 8 (4 published + 4 drafts)");

  for (const lc of myCardLayoutConfigs) {
    await prisma.pageLayout.upsert({
      where: {
        routeId_tenantId_cohortId_viewport_status: {
          routeId: myCardRoute.id,
          tenantId: lc.tenantId,
          cohortId: lc.cohortId,
          viewport: lc.viewport,
          status: "published",
        },
      },
      update: { layoutJson: lc.layoutJson },
      create: {
        routeId: myCardRoute.id,
        ...lc,
        status: "published",
        version: 1,
        publishedAt: new Date(),
        publishedBy: "seed",
      },
    });

    await prisma.pageLayout.upsert({
      where: {
        routeId_tenantId_cohortId_viewport_status: {
          routeId: myCardRoute.id,
          tenantId: lc.tenantId,
          cohortId: lc.cohortId,
          viewport: lc.viewport,
          status: "draft",
        },
      },
      update: { layoutJson: lc.layoutJson },
      create: {
        routeId: myCardRoute.id,
        ...lc,
        status: "draft",
        version: 1,
      },
    });
  }
  console.log("  Layouts (my-card): 8 (4 published + 4 drafts)");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
