export function detectChartType(dataPoint) {
  return Array.isArray(dataPoint[1]);
}

export function getColorForSeries(index) {
  const defaultColors = ["blue", "green", "red"];
  return defaultColors[index] || "gray";
}
