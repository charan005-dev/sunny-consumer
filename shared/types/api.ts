export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface CreateLayoutRequest {
  routeId: string;
  tenantId: string;
  cohortId: string;
  viewport: "desktop" | "mobile";
  layoutJson: Record<string, unknown>;
}

export interface UpdateLayoutRequest {
  layoutJson: Record<string, unknown>;
}

export interface ConsumerLayoutQuery {
  route: string;
  viewport: "desktop" | "mobile";
}
