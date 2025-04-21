import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface RoastRecipePieChartProps {
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
}

// Define the data structure
interface RoastRecipeData {
  name: string;
  value: number;
  roast: string;
  recipe: number;
  color: string;
}

// Roast colors - same as in PreferredRoastsChart
const ROAST_COLORS = {
  "Roaring Volcano": "#c56453",
  "Vibrant Jungle": "#4f8361",
  "Glowing Beach": "#f8c87c",
  "Calm Lake": "#7391b9",
};

// Recipe shade modifiers - same as in PreferredRoastsChart
const RECIPE_SHADES = {
  1: 0, // Base color
  2: 0.15, // 15% lighter
  3: 0.3, // 30% lighter
};

// Helper function to adjust color brightness - same as in PreferredRoastsChart
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

// Transform raw data into pie chart data
const transformDataForPieChart = (): RoastRecipeData[] => {
  // Sample data based on PreferredRoastsChart
  const rawData = [
    {
      name: "Roaring Volcano",
      recipe1: 42,
      recipe2: 8,
      recipe3: 3,
    },
    {
      name: "Glowing Beach",
      recipe1: 5,
      recipe2: 32,
      recipe3: 4,
    },
    {
      name: "Vibrant Jungle",
      recipe1: 7,
      recipe2: 15,
      recipe3: 35,
    },
    {
      name: "Calm Lake",
      recipe1: 25,
      recipe2: 12,
      recipe3: 5,
    },
  ];

  // Calculate total shots
  const totalShots = rawData.reduce(
    (sum, roast) => sum + roast.recipe1 + roast.recipe2 + roast.recipe3,
    0,
  );

  // Transform data for pie chart
  const pieData: RoastRecipeData[] = [];

  rawData.forEach((roast) => {
    const baseColor = ROAST_COLORS[roast.name];

    // Always add all three recipes for each roast
    pieData.push({
      name: `${roast.name} - Recipe 1`,
      value: roast.recipe1,
      roast: roast.name,
      recipe: 1,
      color: baseColor,
    });

    pieData.push({
      name: `${roast.name} - Recipe 2`,
      value: roast.recipe2,
      roast: roast.name,
      recipe: 2,
      color: adjustColor(baseColor, RECIPE_SHADES[2]),
    });

    pieData.push({
      name: `${roast.name} - Recipe 3`,
      value: roast.recipe3,
      roast: roast.name,
      recipe: 3,
      color: adjustColor(baseColor, RECIPE_SHADES[3]),
    });
  });

  return pieData;
};

// Custom tooltip to show percentage
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
        <p className="font-medium">{data.roast}</p>
        <p className="text-sm" style={{ color: data.color }}>
          Recipe {data.recipe}: {data.value} shots
        </p>
        <p className="text-xs text-muted-foreground">
          {(
            (data.value /
              transformDataForPieChart().reduce(
                (sum, item) => sum + item.value,
                0,
              )) *
            100
          ).toFixed(1)}
          % of total
        </p>
      </div>
    );
  }
  return null;
};

const RoastRecipePieChart: React.FC<RoastRecipePieChartProps> = ({
  isLoading = false,
  timeRange: externalTimeRange = "30d",
  onTimeRangeChange: externalOnTimeRangeChange = () => {},
}) => {
  // Use internal state if no external control is provided
  const [internalTimeRange, setInternalTimeRange] =
    React.useState<TimeRangeValue>("30d");

  // Use external time range if provided, otherwise use internal state
  const timeRange =
    externalTimeRange !== undefined ? externalTimeRange : internalTimeRange;

  const handleTimeRangeChange = (value: TimeRangeValue) => {
    // If external handler is provided, use it
    if (externalOnTimeRangeChange) {
      externalOnTimeRangeChange(value);
    } else {
      // Otherwise use internal state
      setInternalTimeRange(value);
    }
    console.log(`Roast Recipe time range changed to ${value}`);
  };
  if (isLoading) {
    return (
      <div className="h-[300px] animate-pulse bg-gray-200 rounded-md"></div>
    );
  }

  const data = transformDataForPieChart();

  // Custom renderer for the legend to group by roast
  const renderLegend = (props: any) => {
    const { payload } = props;

    // Group by roast
    const roastGroups: Record<string, RoastRecipeData[]> = {};
    payload.forEach((entry: any) => {
      const { roast } = entry.payload;
      if (!roastGroups[roast]) {
        roastGroups[roast] = [];
      }
      roastGroups[roast].push(entry.payload);
    });

    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
        {Object.entries(roastGroups).map(([roast, recipes]) => (
          <li key={roast} className="flex flex-col items-start">
            <span className="font-medium">{roast}</span>
            <div className="flex flex-col gap-1 ml-2">
              {recipes.map((recipe) => (
                <div key={recipe.name} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: recipe.color }}
                  />
                  <span>Recipe {recipe.recipe}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex-1" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} verticalAlign="bottom" height={60} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoastRecipePieChart;
