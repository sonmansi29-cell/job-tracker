import React from "react";

function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) return null;

  // Calculate cumulative percentages for conic-gradient
  let cumulativePercent = 0;
  const gradients = data.map((item) => {
    const startPercent = cumulativePercent;
    cumulativePercent += (item.value / total) * 100;
    const endPercent = cumulativePercent;
    return `${item.color} ${startPercent}% ${endPercent}%`;
  }).join(", ");

  // Calculate percentage for display
  const getPercent = (value) => ((value / total) * 100).toFixed(1);

  return (
    <div className="donut-chart-wrapper">
      <div className="donut-chart-main">
        <div 
          className="donut-chart"
          style={{
            background: `conic-gradient(${gradients})`
          }}
        >
          <div className="donut-center">
            <span className="donut-total">{total}</span>
            <span className="donut-label">Total Jobs</span>
          </div>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-name">{item.name}</span>
            <span className="legend-value">{item.value}</span>
            <span className="legend-percent">{getPercent(item.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonutChart;

