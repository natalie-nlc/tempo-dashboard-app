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

import { TimeRangeValue } from "@/components/common/TimeRangeFilter";

interface CoffeePreferencePieChartProps {
  data?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

// Data sets for different time ranges
const dataByTimeRange = {
  "30m": [
    { name: "Espresso", value: 3, color: "#8884d8" },
    { name: "Americano", value: 1, color: "#82ca9d" },
    { name: "Cappuccino", value: 0, color: "#ffc658" },
    { name: "Latte", value: 0, color: "#ff8042" },
  ],
  "1h": [
    { name: "Espresso", value: 4, color: "#8884d8" },
    { name: "Americano", value: 2, color: "#82ca9d" },
    { name: "Cappuccino", value: 1, color: "#ffc658" },
    { name: "Latte", value: 1, color: "#ff8042" },
  ],
  "4h": [
    { name: "Espresso", value: 8, color: "#8884d8" },
    { name: "Americano", value: 3, color: "#82ca9d" },
    { name: "Cappuccino", value: 4, color: "#ffc658" },
    { name: "Latte", value: 2, color: "#ff8042" },
  ],
  "8h": [
    { name: "Espresso", value: 12, color: "#8884d8" },
    { name: "Americano", value: 5, color: "#82ca9d" },
    { name: "Cappuccino", value: 7, color: "#ffc658" },
    { name: "Latte", value: 4, color: "#ff8042" },
  ],
  "24h": [
    { name: "Espresso", value: 15, color: "#8884d8" },
    { name: "Americano", value: 8, color: "#82ca9d" },
    { name: "Cappuccino", value: 10, color: "#ffc658" },
    { name: "Latte", value: 7, color: "#ff8042" },
  ],
  "3d": [
    { name: "Espresso", value: 18, color: "#8884d8" },
    { name: "Americano", value: 10, color: "#82ca9d" },
    { name: "Cappuccino", value: 14, color: "#ffc658" },
    { name: "Latte", value: 9, color: "#ff8042" },
  ],
  "7d": [
    { name: "Espresso", value: 22, color: "#8884d8" },
    { name: "Americano", value: 11, color: "#82ca9d" },
    { name: "Cappuccino", value: 16, color: "#ffc658" },
    { name: "Latte", value: 10, color: "#ff8042" },
  ],
  "30d": [
    { name: "Espresso", value: 24, color: "#8884d8" },
    { name: "Americano", value: 12, color: "#82ca9d" },
    { name: "Cappuccino", value: 18, color: "#ffc658" },
    { name: "Latte", value: 12, color: "#ff8042" },
  ],
  custom: [
    { name: "Espresso", value: 30, color: "#8884d8" },
    { name: "Americano", value: 15, color: "#82ca9d" },
    { name: "Cappuccino", value: 22, color: "#ffc658" },
    { name: "Latte", value: 18, color: "#ff8042" },
    { name: "Mocha", value: 5, color: "#ff5252" },
  ],
};

const defaultData = dataByTimeRange["30d"];

const CoffeePreferencePieChart: React.FC<CoffeePreferencePieChartProps> = ({
  data,
  isLoading = false,
  timeRange = "30d",
}) => {
  // Use the appropriate data set based on the time range
  const displayData = data || dataByTimeRange[timeRange] || defaultData;
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coffee Preferences</CardTitle>
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
      <CardHeader>
        <CardTitle>Coffee Preferences</CardTitle>
        <CardDescription>
          Distribution of coffee types prepared with this machine, showing the
          percentage breakdown of different coffee styles preferred by users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} drinks`, "Quantity"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoffeePreferencePieChart;
