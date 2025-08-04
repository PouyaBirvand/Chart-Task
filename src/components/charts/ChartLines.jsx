import * as d3 from "d3";
import { colors } from "../../constants/charts/ChartColors";

export const createLineGenerator = (xScale, yScale) => {
  return d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .defined((d) => d[1] !== null && d[1] !== undefined);
};

export const drawLine = (g, seriesData, color, lineGenerator) => {
  const filtered = seriesData.filter((d) => d[1] !== null && d[1] !== undefined);
  if (filtered.length > 0) {
    g.append("path")
      .datum(seriesData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);
  }
};

export const renderLines = (g, data, isMulti, lineGenerator) => {
  if (isMulti) {
    // Multi-series: render exactly 3 lines with Blue, Green, Red
    for (let i = 0; i < 3; i++) {
      const series = data.map((d) => [
        d[0],
        d[1] && Array.isArray(d[1]) && d[1][i] !== undefined ? d[1][i] : null
      ]);

      drawLine(g, series, colors[i], lineGenerator);
    }
  } else {
    // Single-series: render one line
    drawLine(g, data, "steelblue", lineGenerator);
  }
};