import React from "react";
import data from "../data/data.json";
import Chart from "./Chart";

const ChartContainer = () => {
  return (
    <div className="flex md:flex-row flex-col items-center justify-center gap-8 min-h-[100vh]">
      {data.map((chart, index) => (
        <div key={index}>
          <h3>{chart.title}</h3>
          <Chart data={chart.data} />
        </div>
      ))}
    </div>
  );
};

export default ChartContainer;
