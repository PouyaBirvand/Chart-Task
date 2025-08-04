import { useState, useEffect } from "react";

export const useChartSize = (containerRef) => {
  const [size, setSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      const width = containerRef.current?.offsetWidth || 800;
      const height = width * 0.5;
      setSize({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  return size;
};