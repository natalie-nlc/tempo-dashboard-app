import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TimeRangeValue } from "../common/TimeRangeFilter";

interface DataPoint {
  date: string;
  avgDeviation: number;
  upperLimit: number;
  lowerLimit: number;
}

interface AvgDoseDeviationChartProps {
  timeRange: TimeRangeValue;
  className?: string;
}

const AvgDoseDeviationChart: React.FC<AvgDoseDeviationChartProps> = ({
  timeRange,
  className = "",
}) => {
  // Mock data generation based on time range
  const generateMockData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    let days = 30;

    switch (timeRange) {
      case "30m":
      case "1h":
      case "4h":
      case "8h":
      case "24h":
        // For shorter time ranges, show hourly data points
        days = 1;
        for (let i = 0; i < 24; i++) {
          const hour = i.toString().padStart(2, "0");
          data.push({
            date: `${hour}:00`,
            avgDeviation: (Math.random() * 0.4 - 0.2).toFixed(
              2,
            ) as unknown as number,
            upperLimit: 0.5,
            lowerLimit: -0.5,
          });
        }
        break;
      case "3d":
        days = 3;
        break;
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      default:
        days = 30;
    }

    // For daily data points (3d, 7d, 30d, 90d)
    if (days > 1) {
      const today = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        data.push({
          date: dateStr,
          avgDeviation: (Math.random() * 0.4 - 0.2).toFixed(
            2,
          ) as unknown as number,
          upperLimit: 0.5,
          lowerLimit: -0.5,
        });
      }
    }

    return data;
  };

  const data = generateMockData();

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[-1, 1]} tickFormatter={(value) => `${value}g`} />
          <Tooltip
            formatter={(value) => [`${value}g`, "Avg Deviation"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <ReferenceLine
            y={0}
            stroke="#888"
            strokeDasharray="3 3"
            label={{ value: "Target", position: "insideBottomRight" }}
          />
          <ReferenceLine
            y={0.5}
            stroke="#ff0000"
            strokeDasharray="3 3"
            label={{ value: "+0.5g", position: "insideTopRight" }}
          />
          <ReferenceLine
            y={-0.5}
            stroke="#ff0000"
            strokeDasharray="3 3"
            label={{ value: "-0.5g", position: "insideBottomRight" }}
          />
          <Line
            type="monotone"
            dataKey="avgDeviation"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AvgDoseDeviationChart;
