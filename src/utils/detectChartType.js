export function isMultiSeries(dataPoint) {
  return Array.isArray(dataPoint[1]);
}
