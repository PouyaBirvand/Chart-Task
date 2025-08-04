import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useChartSize } from "../../hooks/charts/useChartSize";
import { createScales } from "../../utils/charts/ChartUtils";
import { renderAxes } from "./ChartAxes";
import { createLineGenerator, renderLines } from "./ChartLines";

const Chart = ({ data, title }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const size = useChartSize(containerRef);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = size.width - margin.left - margin.right;
    const height = size.height - margin.top - margin.bottom;

    // Handle edge case: invalid dimensions
    if (width <= 0 || height <= 0) return;

    const g = svg
      .attr("width", size.width)
      .attr("height", size.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    try {
      // Create scales
      const { xScale, yScale, isMulti } = createScales(data, width, height);

      // Render axes
      renderAxes(g, xScale, yScale, width, height);

      // Create line generator
      const lineGenerator = createLineGenerator(xScale, yScale);

      // Render lines
      renderLines(g, data, isMulti, lineGenerator);
    } catch (error) {
      console.error("Error rendering chart:", error);
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("Error rendering chart");
    }

  }, [data, size]);

  // Error handling - extra credit
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div ref={containerRef} className="chart-wrapper">
        <h3 className="chart-title">{title}</h3>
        <div>No data available for this chart</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="chart-wrapper">
      <h3 className="chart-title">{title}</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Chart;