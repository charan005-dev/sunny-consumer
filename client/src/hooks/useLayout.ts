import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useViewport } from "./useViewport";

export interface PageLayoutConfig {
  routePath: string;
  viewport: "desktop" | "mobile";
  gridTemplate: {
    columns: string;
    rows: string;
    gap: string;
    areas: string[];
  };
  slots: Record<
    string,
    {
      componentCode: string;
      gridArea: string;
      props: Record<string, unknown>;
    }
  >;
}

export function useLayout(routePath: string) {
  const viewport = useViewport();

  return useQuery<PageLayoutConfig>({
    queryKey: ["layout", routePath, viewport],
    queryFn: async () => {
      const res = await api.get("/consumer/layout", {
        params: { route: routePath, viewport },
      });
      return res.data.data;
    },
    staleTime: 30_000,
  });
}
