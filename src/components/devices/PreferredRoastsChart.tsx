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
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TimeRangeValue } from "@/components/common/TimeRangeFilter";

interface PreferredRoastsChartProps {
  deviceId?: string;
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

// Define the data structure
interface RoastData {
  name: string;
  recipe1: number;
  recipe2: number;
  recipe3: number;
}

// Roast colors
const ROAST_COLORS = {
  "Roaring Volcano": "#c56453",
  "Vibrant Jungle": "#4f8361",
  "Glowing Beach": "#f8c87c",
  "Calm Lake": "#7391b9",
};

// Recipe shade modifiers
const RECIPE_SHADES = {
  recipe1: 0, // Base color
  recipe2: 0.15, // 15% lighter
  recipe3: 0.3, // 30% lighter
};

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
        {payload.map((entry: any, index: number) => {
          // Extract recipe number from the dataKey
          const recipeMatch = entry.dataKey.match(/_recipe(\d+)$/);
          if (recipeMatch && recipeMatch[1]) {
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                Recipe {recipeMatch[1]}: {entry.value} shots
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

// Helper function to adjust color brightness
const adjustColor = (color: string, percent: number) => {
  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Make lighter
  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const PreferredRoastsChart: React.FC<PreferredRoastsChartProps> = ({
  deviceId,
  isLoading = false,
  timeRange: externalTimeRange,
}) => {
  const [internalTimeRange, setInternalTimeRange] = useState<string>("all");

  // Use external time range if provided, otherwise use internal state
  const effectiveTimeRange = externalTimeRange
    ? mapExternalToInternalTimeRange(externalTimeRange)
    : internalTimeRange;

  // Map the external time range to internal time range format
  function mapExternalToInternalTimeRange(timeRange: TimeRangeValue): string {
    switch (timeRange) {
      case "30m":
      case "1h":
      case "4h":
      case "8h":
      case "24h":
        return "week";
      case "3d":
      case "7d":
        return "month";
      case "30d":
      case "custom":
        return "all";
      default:
        return "all";
    }
  }

  // Select data based on time range
  const getChartData = () => {
    switch (effectiveTimeRange) {
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
      // Create custom data keys for each roast's recipes
      const result: any = {
        name: item.name,
        total: item.recipe1 + item.recipe2 + item.recipe3,
      };

      // Add roast-specific recipe data
      result[`${item.name.replace(/\s+/g, "")}_recipe1`] = item.recipe1;
      result[`${item.name.replace(/\s+/g, "")}_recipe2`] = item.recipe2;
      result[`${item.name.replace(/\s+/g, "")}_recipe3`] = item.recipe3;

      return result;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Preferred Roasts & Recipes</CardTitle>
          <CardDescription>
            Number of shots pulled for each roast and recipe
          </CardDescription>
        </div>
        {!externalTimeRange && (
          <Select
            value={internalTimeRange}
            onValueChange={(value) => setInternalTimeRange(value)}
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
        )}
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
              {transformDataForChart().map((entry) => {
                // Get base color for this roast
                const baseColor = ROAST_COLORS[entry.name];

                // Create custom data key names for each roast's recipes
                const recipe1Key = `${entry.name.replace(/\s+/g, "")}_recipe1`;
                const recipe2Key = `${entry.name.replace(/\s+/g, "")}_recipe2`;
                const recipe3Key = `${entry.name.replace(/\s+/g, "")}_recipe3`;

                // Create recipe bars with different shades of the base color
                return [
                  <Bar
                    key={`${entry.name}-recipe1`}
                    dataKey={recipe1Key}
                    stackId={entry.name}
                    fill={baseColor}
                    name={`${entry.name} - Recipe 1`}
                  >
                    <LabelList
                      dataKey={recipe1Key}
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
                  </Bar>,
                  <Bar
                    key={`${entry.name}-recipe2`}
                    dataKey={recipe2Key}
                    stackId={entry.name}
                    fill={adjustColor(baseColor, RECIPE_SHADES.recipe2)}
                    name={`${entry.name} - Recipe 2`}
                  >
                    <LabelList
                      dataKey={recipe2Key}
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
                  </Bar>,
                  <Bar
                    key={`${entry.name}-recipe3`}
                    dataKey={recipe3Key}
                    stackId={entry.name}
                    fill={adjustColor(baseColor, RECIPE_SHADES.recipe3)}
                    name={`${entry.name} - Recipe 3`}
                  >
                    <LabelList
                      dataKey={recipe3Key}
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
                  </Bar>,
                ];
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferredRoastsChart;
