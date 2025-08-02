import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { isMultiSeries } from "../utils/detectChartType";

const Chart = ({ data }) => {
  const svgRef = useRef();
  const width = 500;
  const height = 300;

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const colors = ["blue", "green", "red"];

    const createXScale = () => {
      const timestamps = data.map((d) => d[0]);
      return d3
        .scaleLinear()
        .domain(d3.extent(timestamps))
        .range([60, width - 30]);
    };

    const createYScale = () => {
      const isMulti = isMultiSeries(data[0]);
      let values;
      if (isMulti) {
        values = data.flatMap((d) => d[1].filter((v) => v != null));
      } else {
        values = data.filter((d) => d[1] != null).map((d) => d[1]);
      }
      return d3
        .scaleLinear()
        .domain(d3.extent(values))
        .range([height - 30, 20]);
    };

    const renderAxes = (svg, xScale, yScale) => {
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - 30})`)
        .call(d3.axisBottom(xScale));

      svg
        .append("g")
        .attr("transform", `translate(60, 0)`)
        .call(d3.axisLeft(yScale));
    };

    const renderSingleLine = (svg, xScale, yScale) => {
      const line = d3
        .line()
        .defined((d) => d[1] != null)
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
    };

    const renderMultiLines = (svg, xScale, yScale) => {
      const seriesCount = data[0][1].length;

      for (let i = 0; i < seriesCount; i++) {
        const line = d3
          .line()
          .defined((d) => d[1][i] != null)
          .x((d) => xScale(d[0]))
          .y((d) => yScale(d[1][i]));

        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", colors[i])
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xScale = createXScale();
    const yScale = createYScale();

    renderAxes(svg, xScale, yScale);

    const isMulti = isMultiSeries(data[0]);
    isMulti
      ? renderMultiLines(svg, xScale, yScale)
      : renderSingleLine(svg, xScale, yScale);
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default Chart;
