import React, { useState, useRef } from "react";

interface DataPoint {
  time: number; // Time in seconds
  value: number; // Value at that time
}

interface DataSeries {
  name: string;
  color: string;
  data: DataPoint[];
  visible?: boolean; // New property to control visibility
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  values: { name: string; value: number; color: string }[];
  time: number;
}

interface LineGraphProps {
  data: DataPoint[] | DataSeries[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
  height?: number;
  startTime?: string; // Optional timestamp for x-axis labeling
  smoothing?: boolean; // Option to enable line smoothing
}

const LineGraph: React.FC<LineGraphProps> = ({
  data = [],
  title,
  xLabel,
  yLabel,
  color = "#3b82f6", // blue-500
  height = 250,
  startTime,
  smoothing = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
    values: [],
    time: 0,
  });

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
  // Initialize all series as visible by default
  const [seriesState, setSeriesState] = useState<DataSeries[]>(
    isSingleSeries
      ? [{ name: title, color, data: data as DataPoint[], visible: true }]
      : (data as DataSeries[]).map((series) => ({
          ...series,
          visible: series.visible !== undefined ? series.visible : true,
        })),
  );

  // Toggle visibility of a series
  const toggleSeries = (index: number) => {
    setSeriesState((prev) => {
      const newState = [...prev];
      newState[index] = {
        ...newState[index],
        visible: !newState[index].visible,
      };
      return newState;
    });
  };

  // If any series has no data, show placeholder
  if (seriesState.some((series) => series.data.length === 0)) {
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
  const allDataPoints = seriesState.flatMap((series) => series.data);
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
    if (seriesData.length < 2) return "";

    if (smoothing) {
      // Create a smoothed path using cubic bezier curves
      let path = `M ${getX(seriesData[0].time)} ${getY(seriesData[0].value)}`;

      for (let i = 0; i < seriesData.length - 1; i++) {
        const x1 = getX(seriesData[i].time);
        const y1 = getY(seriesData[i].value);
        const x2 = getX(seriesData[i + 1].time);
        const y2 = getY(seriesData[i + 1].value);

        // Control points for the curve
        const cpx1 = x1 + (x2 - x1) / 3;
        const cpy1 = y1;
        const cpx2 = x1 + (2 * (x2 - x1)) / 3;
        const cpy2 = y2;

        path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
      }

      return path;
    } else {
      // Standard line path
      return seriesData
        .map((point, i) => {
          const x = getX(point.time);
          const y = getY(point.value);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    }
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

  // Handle mouse movement over the graph
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    // Convert mouse position to graph coordinates
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;

    // Calculate the x position in data coordinates
    const xRatio = mouseX / svgWidth;
    const dataX = minX + xRatio * (maxX - minX);

    // Find the closest data points for each visible series
    const tooltipValues = seriesState
      .filter((series) => series.visible)
      .map((series) => {
        // Find the closest point in the series
        const closestPoint = series.data.reduce((prev, curr) => {
          return Math.abs(curr.time - dataX) < Math.abs(prev.time - dataX)
            ? curr
            : prev;
        });

        return {
          name: series.name,
          value: closestPoint.value,
          color: series.color,
        };
      });

    setTooltip({
      visible: true,
      x: mouseX,
      y: mouseY,
      values: tooltipValues,
      time: dataX,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          ref={svgRef}
          viewBox={`-10 0 ${width + 20} ${height100}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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
          {seriesState
            .filter((series) => series.visible)
            .map((series, seriesIndex) => (
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

          {/* Vertical line at hover position */}
          {tooltip.visible && (
            <line
              x1={getX(tooltip.time)}
              y1="0"
              x2={getX(tooltip.time)}
              y2={height100}
              stroke="#9ca3af"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          )}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute bg-background border border-border rounded-md shadow-md p-2 z-10"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform:
                tooltip.x >
                (svgRef.current?.getBoundingClientRect().width || 0) * 0.7
                  ? "translateX(-100%)"
                  : "none",
              maxWidth: "200px",
            }}
          >
            <div className="text-xs font-medium mb-1">
              {formatTimeLabel(tooltip.time)}
            </div>
            <div className="space-y-1">
              {tooltip.values.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs">{item.name}:</span>
                  </div>
                  <span className="text-xs font-medium">
                    {item.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive legend with toggles */}
      {seriesState.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {seriesState.map((series, i) => (
            <button
              key={`legend-${i}`}
              className={`flex items-center gap-1 px-2 py-1 rounded ${series.visible ? "bg-muted/20" : "bg-muted/5"}`}
              onClick={() => toggleSeries(i)}
            >
              <div
                className={`w-3 h-3 rounded-full ${!series.visible ? "opacity-40" : ""}`}
                style={{ backgroundColor: series.color }}
              ></div>
              <span
                className={`text-xs ${!series.visible ? "text-muted-foreground" : ""}`}
              >
                {series.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LineGraph;
