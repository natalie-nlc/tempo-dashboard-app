import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoastUsageChartProps {
  deviceId?: string;
  isLoading?: boolean;
}

// Define the data structure
interface RoastData {
  name: string;
  recipe1: number;
  recipe2: number;
  recipe3: number;
}

// Sample data for all time periods
const allTimeData: RoastData[] = [
  {
    name: "Roaring Volcano",
    recipe1: 42,
    recipe2: 28,
    recipe3: 15,
  },
  {
    name: "Glowing Beach",
    recipe1: 35,
    recipe2: 22,
    recipe3: 18,
  },
  {
    name: "Vibrant Jungle",
    recipe1: 30,
    recipe2: 25,
    recipe3: 20,
  },
  {
    name: "Calm Lake",
    recipe1: 25,
    recipe2: 30,
    recipe3: 10,
  },
];

// Sample data for last month
const lastMonthData: RoastData[] = [
  {
    name: "Roaring Volcano",
    recipe1: 22,
    recipe2: 15,
    recipe3: 8,
  },
  {
    name: "Glowing Beach",
    recipe1: 18,
    recipe2: 12,
    recipe3: 9,
  },
  {
    name: "Vibrant Jungle",
    recipe1: 15,
    recipe2: 13,
    recipe3: 10,
  },
  {
    name: "Calm Lake",
    recipe1: 12,
    recipe2: 15,
    recipe3: 5,
  },
];

// Sample data for last week
const lastWeekData: RoastData[] = [
  {
    name: "Roaring Volcano",
    recipe1: 8,
    recipe2: 5,
    recipe3: 3,
  },
  {
    name: "Glowing Beach",
    recipe1: 6,
    recipe2: 4,
    recipe3: 3,
  },
  {
    name: "Vibrant Jungle",
    recipe1: 5,
    recipe2: 4,
    recipe3: 3,
  },
  {
    name: "Calm Lake",
    recipe1: 4,
    recipe2: 5,
    recipe3: 2,
  },
];

const RoastUsageChart: React.FC<RoastUsageChartProps> = ({
  deviceId,
  isLoading = false,
}) => {
  const [timeRange, setTimeRange] = useState<string>("all");

  // Select data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case "week":
        return lastWeekData;
      case "month":
        return lastMonthData;
      case "all":
      default:
        return allTimeData;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roast Usage</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Roast Usage</CardTitle>
          <CardDescription>
            Number of shots pulled for each roast and recipe
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Shots",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="recipe1"
                stackId="a"
                fill="#8884d8"
                name="Recipe 1"
              />
              <Bar
                dataKey="recipe2"
                stackId="a"
                fill="#82ca9d"
                name="Recipe 2"
              />
              <Bar
                dataKey="recipe3"
                stackId="a"
                fill="#ffc658"
                name="Recipe 3"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoastUsageChart;
