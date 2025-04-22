import React from "react";

interface DataPoint {
  time: number; // Time in seconds
  value: number; // Value at that time
}

interface DataSeries {
  name: string;
  color: string;
  data: DataPoint[];
}

interface LineGraphProps {
  data: DataPoint[] | DataSeries[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
  height?: number;
  startTime?: string; // Optional timestamp for x-axis labeling
}

const LineGraph: React.FC<LineGraphProps> = ({
  data = [],
  title,
  xLabel = "Time (s)",
  yLabel = "Value",
  color = "#3b82f6", // blue-500
  height = 250,
  startTime,
}) => {
  // Check if data is empty
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted/20 rounded-md"
        style={{ height: `${height}px` }}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Determine if we have a single series or multiple series
  const isSingleSeries = !("name" in data[0]);

  // Convert single series to multi-series format for consistent processing
  const allSeries: DataSeries[] = isSingleSeries
    ? [{ name: title, color, data: data as DataPoint[] }]
    : (data as DataSeries[]);

  // If any series has no data, show placeholder
  if (allSeries.some((series) => series.data.length === 0)) {
    return (
      <div
        className="flex items-center justify-center bg-muted/20 rounded-md"
        style={{ height: `${height}px` }}
      >
        <p className="text-muted-foreground">
          No data available for some series
        </p>
      </div>
    );
  }

  // Find min and max values across all series for scaling
  const allDataPoints = allSeries.flatMap((series) => series.data);
  const minX = Math.min(...allDataPoints.map((d) => d.time));
  const maxX = Math.max(...allDataPoints.map((d) => d.time));
  const minY = Math.min(...allDataPoints.map((d) => d.value));
  const maxY = Math.max(...allDataPoints.map((d) => d.value));

  // Add padding to max/min values
  const yPadding = (maxY - minY) * 0.1;
  const paddedMinY = Math.max(0, minY - yPadding);
  const paddedMaxY = maxY + yPadding;

  // Canvas dimensions
  const width = 100;
  const height100 = 100;

  // Function to convert data point to SVG coordinates
  const getX = (time: number) => {
    return ((time - minX) / (maxX - minX)) * width;
  };

  const getY = (value: number) => {
    return (
      height100 - ((value - paddedMinY) / (paddedMaxY - paddedMinY)) * height100
    );
  };

  // Function to generate SVG path for a series
  const generatePathData = (seriesData: DataPoint[]) => {
    return seriesData
      .map((point, i) => {
        const x = getX(point.time);
        const y = getY(point.value);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  // Format timestamp for x-axis labels
  const formatTimeLabel = (seconds: number) => {
    if (!startTime) return seconds.toFixed(0);

    try {
      const baseTime = new Date(startTime);
      const newTime = new Date(baseTime.getTime() + seconds * 1000);
      return newTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      return seconds.toFixed(0);
    }
  };

  return (
    <div className="w-full">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox={`-10 0 ${width + 20} ${height100}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Y-axis */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={height100}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />

          {/* X-axis */}
          <line
            x1="0"
            y1={height100}
            x2={width}
            y2={height100}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height100 * (1 - ratio);
            const value = paddedMinY + ratio * (paddedMaxY - paddedMinY);
            return (
              <g key={`y-${ratio}`}>
                <line
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.2"
                  strokeDasharray="1,1"
                />
                <text
                  x="-5"
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="#6b7280"
                  fontSize="3"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const x = width * ratio;
            const value = minX + ratio * (maxX - minX);
            return (
              <g key={`x-${ratio}`}>
                <line
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={height100}
                  stroke="#e5e7eb"
                  strokeWidth="0.2"
                  strokeDasharray="1,1"
                />
                <text
                  x={x}
                  y={height100 + 5}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="3"
                >
                  {formatTimeLabel(value)}
                </text>
              </g>
            );
          })}

          {/* Data lines for each series */}
          {allSeries.map((series, seriesIndex) => (
            <g key={`series-${seriesIndex}`}>
              <path
                d={generatePathData(series.data)}
                fill="none"
                stroke={series.color}
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </svg>

        {/* Axis labels */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
          {xLabel}
        </div>
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
          {yLabel}
        </div>
      </div>

      {/* Legend moved below the graph */}
      {allSeries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {allSeries.map((series, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: series.color }}
              ></div>
              <span className="text-xs">{series.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LineGraph;
