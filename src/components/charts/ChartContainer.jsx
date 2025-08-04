import React from "react";
import ChartData from "../../data/data.json";
import Chart from "./Chart";

const ChartContainer = () => {
  // Error handling for data loading
  if (!ChartData || !Array.isArray(ChartData)) {
    return <div>Error: Unable to load chart data</div>;
  }

  if (ChartData.length === 0) {
    return <div>No charts available</div>;
  }

  return (
    <div className="chart-grid">
      {ChartData.map((chart, index) => {
        // Validate each chart object
        if (!chart || typeof chart.title !== 'string' || !Array.isArray(chart.data)) {
          console.warn(`Invalid chart data at index ${index}:`, chart);
          return (
            <div key={index} className="chart-wrapper">
              <h3>Chart {index + 1}</h3>
              <div>Invalid chart data</div>
            </div>
          );
        }

        return (
          <Chart 
            key={index} 
            title={chart.title} 
            data={chart.data} 
          />
        );
      })}
    </div>
  );
};

export default ChartContainer;