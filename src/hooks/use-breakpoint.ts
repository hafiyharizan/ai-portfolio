"use client";

import { useEffect, useState } from "react";

export function useBreakpoint() {
  const [w, setW] = useState(0);

  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    isMedium: w > 0 && w <= 1100, // tablet: stack grid
    isSmall:  w > 0 && w <= 720,  // mobile: bottom-sheet modal, stacked metrics
    w,
  };
}
