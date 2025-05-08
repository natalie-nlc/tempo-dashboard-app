import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TimeRangeValue } from "../common/TimeRangeFilter";

interface MachineDowntimeChartProps {
  timeRange: TimeRangeValue;
}

const MachineDowntimeChart: React.FC<MachineDowntimeChartProps> = ({
  timeRange,
}) => {
  // Generate mock data based on time range
  const generateMockData = () => {
    const data = [];
    let days = 0;

    switch (timeRange) {
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      case "1y":
        days = 365;
        break;
      default:
        days = 30;
    }

    // For longer time ranges, group by weeks or months
    const groupBy = days > 30 ? (days > 90 ? "month" : "week") : "day";
    const intervals =
      groupBy === "month"
        ? Math.ceil(days / 30)
        : groupBy === "week"
          ? Math.ceil(days / 7)
          : days;

    const today = new Date();

    for (let i = 0; i < intervals; i++) {
      const date = new Date(today);

      if (groupBy === "month") {
        date.setMonth(date.getMonth() - i);
      } else if (groupBy === "week") {
        date.setDate(date.getDate() - i * 7);
      } else {
        date.setDate(date.getDate() - i);
      }

      // Generate random downtime between 4 and 12 hours
      const baseDowntime = Math.random() * 8 + 4;

      // Add some spikes for visual interest
      const spike = i % 5 === 0 ? Math.random() * 15 : 0;

      const downtime = baseDowntime + spike;

      const label =
        groupBy === "month"
          ? `${date.toLocaleString("default", { month: "short" })}`
          : groupBy === "week"
            ? `Week ${Math.floor(days / 7) - i}`
            : `${date.getDate()}/${date.getMonth() + 1}`;

      data.unshift({
        name: label,
        downtime: parseFloat(downtime.toFixed(1)),
      });
    }

    return data;
  };

  const data = generateMockData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          domain={[0, "dataMax + 5"]}
        />
        <Tooltip
          formatter={(value) => [`${value} hours`, "Downtime"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <ReferenceLine
          y={8}
          stroke="#ff0000"
          strokeDasharray="3 3"
          label={{ value: "Target Max (8h)", position: "top", fill: "#ff0000" }}
        />
        <Bar
          dataKey="downtime"
          fill="#8884d8"
          name="Machine Downtime"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MachineDowntimeChart;
