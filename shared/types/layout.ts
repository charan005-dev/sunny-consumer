export type Viewport = "desktop" | "mobile";
export type LayoutStatus = "draft" | "published";

export interface GridTemplate {
  columns: string;
  rows: string;
  gap: string;
  areas: string[];
}

export interface SlotConfig {
  componentCode: string;
  gridArea: string;
  props: Record<string, unknown>;
}

export interface PageLayoutConfig {
  routePath: string;
  viewport: Viewport;
  gridTemplate: GridTemplate;
  slots: Record<string, SlotConfig>;
}

export interface SlotDefinitionDTO {
  id: string;
  routeId: string;
  slotKey: string;
  name: string;
  allowedSlotTypes: string[];
  required: boolean;
  sortOrder: number;
  viewports: Viewport[];
}

export interface ComponentRegistryDTO {
  id: string;
  code: string;
  name: string;
  description: string | null;
  slotType: string;
  thumbnailUrl: string | null;
  defaultProps: Record<string, unknown> | null;
  propsSchema: Record<string, unknown> | null;
}

export interface PageLayoutDTO {
  id: string;
  routeId: string;
  tenantId: string;
  cohortId: string;
  viewport: Viewport;
  layoutJson: PageLayoutConfig;
  version: number;
  status: LayoutStatus;
  publishedAt: string | null;
  publishedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RouteDTO {
  id: string;
  path: string;
  name: string;
  description: string | null;
  isActive: boolean;
  slotDefinitions?: SlotDefinitionDTO[];
}

export interface TenantDTO {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CohortDTO {
  id: string;
  code: string;
  name: string;
  description: string | null;
  tenantId: string;
  isActive: boolean;
}
