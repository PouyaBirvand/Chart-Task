import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { detectChartType, getColorForSeries } from "../utils/chartUtils";
const Chart = ({ data, title }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [size, setSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const resize = () => {
      const w = containerRef.current?.offsetWidth || 800;
      const width = Math.max(300, Math.min(w - 40, 1200));
      const height = width * 0.5;
      setSize({ width, height });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const isMulti = detectChartType(data[0]);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const { width, height } = size;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const timestamps = data.map(d => new Date(d[0]));
    const xScale = d3.scaleTime()
      .domain(d3.extent(timestamps))
      .range([0, innerWidth]);

    const allValues = isMulti
      ? data.flatMap(d => d[1].filter(v => v != null))
      : data.map(d => d[1]).filter(v => v != null);

    if (!allValues.length) return;

    const yDomain = d3.extent(allValues);
    const yPadding = (yDomain[1] - yDomain[0]) * 0.1;
    const yScale = d3.scaleLinear()
      .domain([yDomain[0] - yPadding, yDomain[1] + yPadding])
      .range([innerHeight, 0]);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(innerWidth / 80).tickFormat(d3.timeFormat("%m/%d")));

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(innerHeight / 50).tickFormat(d3.format(".2s")));

    const lineGenerator = d3.line()
      .x(d => xScale(new Date(d[0])))
      .y(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    const drawLine = (seriesData, color) => {
      const filtered = seriesData.filter(d => d[1] != null);
      if (filtered.length === 0) return;

      g.append("path")
        .datum(filtered)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    };

    if (isMulti) {
      const seriesCount = data[0][1].length;
      for (let i = 0; i < seriesCount; i++) {
        const series = data.map(d => [d[0], d[1][i]]);
        drawLine(series, getColorForSeries(i));
      }
    } else {
      drawLine(data, "steelblue");
    }
  }, [data, size]);

  return (
    <div ref={containerRef} className="chart-wrapper">
      <h3 className="chart-title">{title}</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Chart;
