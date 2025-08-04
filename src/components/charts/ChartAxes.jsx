import * as d3 from "d3";

export const renderAxes = (g, xScale, yScale, width, height) => {
  // X Axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickFormat(d3.format("d"))
    );

  // Y Axis
  g.append("g").call(
    d3
      .axisLeft(yScale)
      .ticks(height / 50)
      .tickFormat(d3.format(".2s"))
  );
};