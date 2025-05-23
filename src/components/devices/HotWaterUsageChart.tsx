import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeRangeValue } from "@/components/common/TimeRangeFilter";

interface HotWaterUsageChartProps {
  data?: Array<{
    date: string;
    volume: number;
  }>;
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

const generateLastMonthData = () => {
  const data = [];
  const today = new Date();
  const daysInMonth = 30;

  for (let i = daysInMonth - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

    // Generate random volume between 50 and 300ml with some days having 0
    const volume =
      Math.random() > 0.2 ? Math.floor(Math.random() * 250) + 50 : 0;

    data.push({
      date: formattedDate,
      volume,
    });
  }

  return data;
};

const generateLastWeekData = () => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

    // Generate random volume between 50 and 300ml with some days having 0
    const volume =
      Math.random() > 0.2 ? Math.floor(Math.random() * 250) + 50 : 0;

    data.push({
      date: formattedDate,
      volume,
    });
  }

  return data;
};

const generateLast3MonthsData = () => {
  const data = [];
  const today = new Date();
  const daysIn3Months = 90;

  // Generate data for every 3 days to avoid overcrowding
  for (let i = daysIn3Months - 1; i >= 0; i -= 3) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

    // Generate random volume between 50 and 300ml with some days having 0
    const volume =
      Math.random() > 0.2 ? Math.floor(Math.random() * 250) + 50 : 0;

    data.push({
      date: formattedDate,
      volume,
    });
  }

  return data;
};

const defaultData = generateLastMonthData();

const HotWaterUsageChart: React.FC<HotWaterUsageChartProps> = ({
  data = defaultData,
  isLoading = false,
  timeRange: externalTimeRange,
}) => {
  const [internalTimeRange, setInternalTimeRange] = useState<
    "week" | "month" | "3months"
  >("month");
  const [chartData, setChartData] = useState(data);

  // Map external time range to internal time range format
  const mapExternalToInternalTimeRange = (
    timeRange: TimeRangeValue,
  ): "week" | "month" | "3months" => {
    switch (timeRange) {
      case "30m":
      case "1h":
      case "4h":
      case "8h":
      case "24h":
      case "3d":
      case "7d":
        return "week";
      case "30d":
        return "month";
      case "custom":
        return "3months";
      default:
        return "month";
    }
  };

  // Use external time range if provided, otherwise use internal state
  const effectiveTimeRange = externalTimeRange
    ? mapExternalToInternalTimeRange(externalTimeRange)
    : internalTimeRange;

  // Update chart data when external time range changes
  useEffect(() => {
    if (externalTimeRange) {
      const mappedRange = mapExternalToInternalTimeRange(externalTimeRange);
      if (mappedRange === "week") {
        setChartData(generateLastWeekData());
      } else if (mappedRange === "month") {
        setChartData(generateLastMonthData());
      } else if (mappedRange === "3months") {
        setChartData(generateLast3MonthsData());
      }
    }
  }, [externalTimeRange]);

  const handleTimeRangeChange = (value: string) => {
    if (value === "week") {
      setChartData(generateLastWeekData());
    } else if (value === "month") {
      setChartData(generateLastMonthData());
    } else if (value === "3months") {
      setChartData(generateLast3MonthsData());
    }
    setInternalTimeRange(value as "week" | "month" | "3months");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hot Water Usage</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] animate-pulse bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Hot Water Usage</CardTitle>
          <CardDescription>
            Volume of hot water dispensed over time (ml), tracking non-coffee
            usage patterns and helping identify potential maintenance needs
          </CardDescription>
        </div>
        {!externalTimeRange && (
          <Select
            value={internalTimeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                interval={
                  effectiveTimeRange === "3months"
                    ? 5
                    : effectiveTimeRange === "month"
                      ? 2
                      : 0
                }
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, "dataMax + 50"]}
                label={{
                  value: "ml",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} ml`, "Volume"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Hot Water Volume"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotWaterUsageChart;
