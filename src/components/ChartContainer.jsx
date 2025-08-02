import React from "react";
import ChartData from "../data/data.json";
import Chart from "./Chart";

const ChartContainer = () => {
  return (
    <div className="chart-grid">
      {ChartData.map((chart, index) => (
        <Chart key={index} title={chart.title} data={chart.data} />
      ))}
    </div>
  );
};

export default ChartContainer;
