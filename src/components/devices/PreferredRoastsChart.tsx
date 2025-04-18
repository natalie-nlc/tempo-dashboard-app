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
  Cell,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PreferredRoastsChartProps {
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

// Sample data for all time periods - more varied
const allTimeData: RoastData[] = [
  {
    name: "Roaring Volcano",
    recipe1: 42,
    recipe2: 8,
    recipe3: 0,
  },
  {
    name: "Glowing Beach",
    recipe1: 5,
    recipe2: 32,
    recipe3: 0,
  },
  {
    name: "Vibrant Jungle",
    recipe1: 0,
    recipe2: 15,
    recipe3: 35,
  },
  {
    name: "Calm Lake",
    recipe1: 25,
    recipe2: 0,
    recipe3: 0,
  },
];

// Sample data for last month - more varied
const lastMonthData: RoastData[] = [
  {
    name: "Roaring Volcano",
    recipe1: 22,
    recipe2: 5,
    recipe3: 0,
  },
  {
    name: "Glowing Beach",
    recipe1: 3,
    recipe2: 18,
    recipe3: 0,
  },
  {
    name: "Vibrant Jungle",
    recipe1: 0,
    recipe2: 8,
    recipe3: 15,
  },
  {
    name: "Calm Lake",
    recipe1: 12,
    recipe2: 0,
    recipe3: 0,
  },
];

// Sample data for last week - more varied
const lastWeekData: RoastData[] = [
  {
    name: "Roaring Volcano",
    recipe1: 8,
    recipe2: 0,
    recipe3: 0,
  },
  {
    name: "Glowing Beach",
    recipe1: 1,
    recipe2: 5,
    recipe3: 0,
  },
  {
    name: "Vibrant Jungle",
    recipe1: 0,
    recipe2: 2,
    recipe3: 5,
  },
  {
    name: "Calm Lake",
    recipe1: 4,
    recipe2: 0,
    recipe3: 0,
  },
];

// Custom tooltip to show recipe numbers
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm">
            Recipe {entry.name.replace("recipe", "")}: {entry.value} shots
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PreferredRoastsChart: React.FC<PreferredRoastsChartProps> = ({
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
          <CardTitle>Preferred Roasts</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for stacked bar chart with recipe labels
  const transformDataForChart = () => {
    const data = getChartData();
    return data.map((item) => {
      return {
        name: item.name,
        recipe1: item.recipe1,
        recipe2: item.recipe2,
        recipe3: item.recipe3,
        total: item.recipe1 + item.recipe2 + item.recipe3,
      };
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Preferred Roasts</CardTitle>
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
            <BarChart data={transformDataForChart()} barSize={60}>
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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="recipe1" stackId="a" fill="#8884d8">
                <LabelList
                  dataKey="recipe1"
                  position="center"
                  content={(props: any) => {
                    const { x, y, width, height, value } = props;
                    if (!value || value === 0) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        1
                      </text>
                    );
                  }}
                />
              </Bar>
              <Bar dataKey="recipe2" stackId="a" fill="#8884d8">
                <LabelList
                  dataKey="recipe2"
                  position="center"
                  content={(props: any) => {
                    const { x, y, width, height, value } = props;
                    if (!value || value === 0) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        2
                      </text>
                    );
                  }}
                />
              </Bar>
              <Bar dataKey="recipe3" stackId="a" fill="#8884d8">
                <LabelList
                  dataKey="recipe3"
                  position="center"
                  content={(props: any) => {
                    const { x, y, width, height, value } = props;
                    if (!value || value === 0) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        3
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferredRoastsChart;
