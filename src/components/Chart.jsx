import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { colors } from "../constants/ChartColors";

const Chart = ({ data, title }) => {
  const svgRef = useRef();
  const containerRef = useRef();
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
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = size.width - margin.left - margin.right;
    const height = size.height - margin.top - margin.bottom;

    const g = svg
      .attr("width", size.width)
      .attr("height", size.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const timestamps = data.map((d) => new Date(d[0]));
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(timestamps))
      .range([0, width]);

    const allValues = data.flatMap((d) => d[1]).filter((v) => v != null);
    const yDomain = d3.extent(allValues);
    const yScale = d3
      .scaleLinear()
      .domain([yDomain[0], yDomain[1]])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(width / 80)
          .tickFormat(d3.timeFormat("%m/%d"))
      );

    g.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(height / 50)
        .tickFormat(d3.format(".2s"))
    );

    const lineGenerator = d3
      .line()
      .x((d) => xScale(new Date(d[0])))
      .y((d) => yScale(d[1]));

    const drawLine = (seriesData, color) => {
      const filtered = seriesData.filter((d) => d[1] != null);
      if (filtered.length > 0) {
        g.append("path")
          .datum(filtered)
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("d", lineGenerator);
      }
    };

    const isMulti = Array.isArray(data[0][1]);
    if (isMulti) {
      data[0][1].forEach((_, i) => {
        const series = data.map((d) => [d[0], d[1][i]]);
        drawLine(series, colors[i % colors.length]);
      });
    } else {
      drawLine(data, colors[0]);
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
