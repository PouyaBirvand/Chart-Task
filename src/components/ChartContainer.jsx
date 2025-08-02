import React from "react";
import data from "../data/data.json";
import Chart from "./Chart";

const ChartContainer = () => {
  return (
    <div className="chart-grid">
      {data.map((chart, index) => (
        <Chart key={index} title={chart.title} data={chart.data} />
      ))}
    </div>
  );
};

export default ChartContainer;
