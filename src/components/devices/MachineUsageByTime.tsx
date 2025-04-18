import React from "react";
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

import { TimeRangeValue } from "@/components/common/TimeRangeFilter";

interface MachineUsageByTimeProps {
  data?: Array<{
    hour: string;
    roaringVolcano?: number;
    glowingBeach?: number;
    vibrantJungle?: number;
    calmLake?: number;
  }>;
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

// Roast colors
const ROAST_COLORS = {
  roaringVolcano: "#c56453",
  vibrantJungle: "#4f8361",
  glowingBeach: "#f8c87c",
  calmLake: "#7391b9",
};

// Data sets for different time ranges with roast breakdown, grouped in 2-hour segments
const dataByTimeRange = {
  "30m": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "1h": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 1,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 1,
      glowingBeach: 2,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "4h": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 1,
      glowingBeach: 0,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "8h": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 2,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 1,
      glowingBeach: 0,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10PM-12AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "24h": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 3,
      glowingBeach: 1,
      vibrantJungle: 2,
      calmLake: 0,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 3,
      glowingBeach: 3,
      vibrantJungle: 0,
      calmLake: 2,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "12PM-2PM",
      roaringVolcano: 1,
      glowingBeach: 2,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2PM-4PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "4PM-6PM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 2,
      calmLake: 0,
    },
    {
      hour: "6PM-8PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "8PM-10PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10PM-12AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "3d": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 1,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 0,
      glowingBeach: 1,
      vibrantJungle: 0,
      calmLake: 1,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 4,
      glowingBeach: 3,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "12PM-2PM",
      roaringVolcano: 2,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "2PM-4PM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "4PM-6PM",
      roaringVolcano: 2,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "6PM-8PM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "8PM-10PM",
      roaringVolcano: 1,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10PM-12AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "7d": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 6,
      glowingBeach: 4,
      vibrantJungle: 3,
      calmLake: 2,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 5,
      glowingBeach: 3,
      vibrantJungle: 2,
      calmLake: 2,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "12PM-2PM",
      roaringVolcano: 4,
      glowingBeach: 3,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "2PM-4PM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "4PM-6PM",
      roaringVolcano: 4,
      glowingBeach: 3,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "6PM-8PM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "8PM-10PM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10PM-12AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
  "30d": [
    {
      hour: "12AM-2AM",
      roaringVolcano: 8,
      glowingBeach: 5,
      vibrantJungle: 4,
      calmLake: 2,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 6,
      glowingBeach: 4,
      vibrantJungle: 3,
      calmLake: 2,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 10,
      glowingBeach: 7,
      vibrantJungle: 5,
      calmLake: 3,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 15,
      glowingBeach: 10,
      vibrantJungle: 8,
      calmLake: 4,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 12,
      glowingBeach: 8,
      vibrantJungle: 6,
      calmLake: 3,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 8,
      glowingBeach: 6,
      vibrantJungle: 4,
      calmLake: 2,
    },
    {
      hour: "12PM-2PM",
      roaringVolcano: 9,
      glowingBeach: 6,
      vibrantJungle: 5,
      calmLake: 2,
    },
    {
      hour: "2PM-4PM",
      roaringVolcano: 7,
      glowingBeach: 5,
      vibrantJungle: 3,
      calmLake: 2,
    },
    {
      hour: "4PM-6PM",
      roaringVolcano: 10,
      glowingBeach: 7,
      vibrantJungle: 5,
      calmLake: 2,
    },
    {
      hour: "6PM-8PM",
      roaringVolcano: 6,
      glowingBeach: 4,
      vibrantJungle: 3,
      calmLake: 2,
    },
    {
      hour: "8PM-10PM",
      roaringVolcano: 4,
      glowingBeach: 3,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "10PM-12AM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 0,
    },
  ],
  custom: [
    {
      hour: "12AM-2AM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "2AM-4AM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "4AM-6AM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "6AM-8AM",
      roaringVolcano: 4,
      glowingBeach: 3,
      vibrantJungle: 2,
      calmLake: 1,
    },
    {
      hour: "8AM-10AM",
      roaringVolcano: 3,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "10AM-12PM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "12PM-2PM",
      roaringVolcano: 2,
      glowingBeach: 2,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "2PM-4PM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 0,
    },
    {
      hour: "4PM-6PM",
      roaringVolcano: 2,
      glowingBeach: 1,
      vibrantJungle: 1,
      calmLake: 1,
    },
    {
      hour: "6PM-8PM",
      roaringVolcano: 1,
      glowingBeach: 1,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "8PM-10PM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
    {
      hour: "10PM-12AM",
      roaringVolcano: 0,
      glowingBeach: 0,
      vibrantJungle: 0,
      calmLake: 0,
    },
  ],
};

const defaultData = dataByTimeRange["24h"];

// Custom tooltip to show roast breakdown
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce(
      (sum: number, entry: any) => sum + (entry.value || 0),
      0,
    );

    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm font-medium">Total: {total} shots</p>
        {payload.map((entry: any) => {
          if (entry.value > 0) {
            let roastName = "";
            switch (entry.dataKey) {
              case "roaringVolcano":
                roastName = "Roaring Volcano";
                break;
              case "glowingBeach":
                roastName = "Glowing Beach";
                break;
              case "vibrantJungle":
                roastName = "Vibrant Jungle";
                break;
              case "calmLake":
                roastName = "Calm Lake";
                break;
            }
            return (
              <p
                key={entry.dataKey}
                className="text-sm"
                style={{ color: entry.color }}
              >
                {roastName}: {entry.value} shots
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

const MachineUsageByTime: React.FC<MachineUsageByTimeProps> = ({
  data,
  isLoading = false,
  timeRange = "24h",
}) => {
  // Use the appropriate data set based on the time range
  const displayData = data || dataByTimeRange[timeRange] || defaultData;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage by Time of Day</CardTitle>
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
        <CardTitle>Usage by Time of Day</CardTitle>
        <CardDescription>
          Number of espresso shots pulled throughout the day by roast type
          (2-hour segments)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="roaringVolcano"
                stackId="a"
                fill={ROAST_COLORS.roaringVolcano}
                radius={[0, 0, 0, 0]}
                name="Roaring Volcano"
              />
              <Bar
                dataKey="glowingBeach"
                stackId="a"
                fill={ROAST_COLORS.glowingBeach}
                radius={[0, 0, 0, 0]}
                name="Glowing Beach"
              />
              <Bar
                dataKey="vibrantJungle"
                stackId="a"
                fill={ROAST_COLORS.vibrantJungle}
                radius={[0, 0, 0, 0]}
                name="Vibrant Jungle"
              />
              <Bar
                dataKey="calmLake"
                stackId="a"
                fill={ROAST_COLORS.calmLake}
                radius={[4, 4, 0, 0]}
                name="Calm Lake"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineUsageByTime;
