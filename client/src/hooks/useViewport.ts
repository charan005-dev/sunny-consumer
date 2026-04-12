import { useState, useEffect } from "react";

type Viewport = "desktop" | "mobile";

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(
    window.innerWidth < 768 ? "mobile" : "desktop"
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => {
      setViewport(e.matches ? "mobile" : "desktop");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return viewport;
}
