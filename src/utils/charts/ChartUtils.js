import * as d3 from "d3";

export const detectChartType = (data) => {
  for (let i = 0; i < data.length; i++) {
    const value = data[i][1];
    if (value !== null) {
      return Array.isArray(value);
    }
  }
  return false;
};

export const calculateDomain = (data, isMulti) => {
  let allValues = [];
  
  if (isMulti) {
    data.forEach((d) => {
      if (d[1] && Array.isArray(d[1])) {
        d[1].forEach((val) => {
          if (val !== null && val !== undefined) allValues.push(val);
        });
      }
    });
  } else {
    allValues = data.map((d) => d[1]).filter((v) => v !== null && v !== undefined);
  }

  return allValues.length > 0 ? d3.extent(allValues) : [0, 1]; // fallback for empty data
};

export const createScales = (data, width, height) => {
  const timestamps = data.map((d) => d[0]);
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(timestamps))
    .range([0, width]);

  const isMulti = detectChartType(data);
  const yDomain = calculateDomain(data, isMulti);
  const yScale = d3
    .scaleLinear()
    .domain([yDomain[0], yDomain[1]])
    .range([height, 0]);

  return { xScale, yScale, isMulti };
};