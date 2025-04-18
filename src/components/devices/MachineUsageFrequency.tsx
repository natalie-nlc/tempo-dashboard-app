import React from "react";
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

import { TimeRangeValue } from "@/components/common/TimeRangeFilter";

interface MachineUsageFrequencyProps {
  data?: Array<{
    date: string;
    shots: number;
  }>;
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

// Data sets for different time ranges
const dataByTimeRange = {
  "30m": [
    { date: "6:00 PM", shots: 1 },
    { date: "6:05 PM", shots: 0 },
    { date: "6:10 PM", shots: 1 },
    { date: "6:15 PM", shots: 0 },
    { date: "6:20 PM", shots: 2 },
    { date: "6:25 PM", shots: 0 },
  ],
  "1h": [
    { date: "5:30 PM", shots: 0 },
    { date: "5:40 PM", shots: 1 },
    { date: "5:50 PM", shots: 0 },
    { date: "6:00 PM", shots: 1 },
    { date: "6:10 PM", shots: 2 },
    { date: "6:20 PM", shots: 0 },
    { date: "6:30 PM", shots: 1 },
  ],
  "4h": [
    { date: "3:00 PM", shots: 1 },
    { date: "3:30 PM", shots: 0 },
    { date: "4:00 PM", shots: 2 },
    { date: "4:30 PM", shots: 1 },
    { date: "5:00 PM", shots: 0 },
    { date: "5:30 PM", shots: 1 },
    { date: "6:00 PM", shots: 2 },
    { date: "6:30 PM", shots: 1 },
  ],
  "8h": [
    { date: "11:00 AM", shots: 2 },
    { date: "12:00 PM", shots: 3 },
    { date: "1:00 PM", shots: 1 },
    { date: "2:00 PM", shots: 0 },
    { date: "3:00 PM", shots: 2 },
    { date: "4:00 PM", shots: 1 },
    { date: "5:00 PM", shots: 3 },
    { date: "6:00 PM", shots: 2 },
  ],
  "24h": [
    { date: "May 14 - Morning", shots: 5 },
    { date: "May 14 - Noon", shots: 3 },
    { date: "May 14 - Afternoon", shots: 2 },
    { date: "May 14 - Evening", shots: 4 },
  ],
  "3d": [
    { date: "May 12", shots: 8 },
    { date: "May 13", shots: 6 },
    { date: "May 14", shots: 10 },
  ],
  "7d": [
    { date: "May 8", shots: 6 },
    { date: "May 9", shots: 28 }, // Outlier - maybe had guests over
    { date: "May 10", shots: 4 },
    { date: "May 11", shots: 3 },
    { date: "May 12", shots: 2 },
    { date: "May 13", shots: 1 },
    { date: "May 14", shots: 3 },
  ],
  "30d": [
    { date: "May 1", shots: 3 },
    { date: "May 2", shots: 2 },
    { date: "May 3", shots: 4 },
    { date: "May 4", shots: 3 },
    { date: "May 5", shots: 5 },
    { date: "May 6", shots: 2 },
    { date: "May 7", shots: 0 },
    { date: "May 8", shots: 6 },
    { date: "May 9", shots: 28 }, // Outlier - maybe had guests over
    { date: "May 10", shots: 4 },
    { date: "May 11", shots: 3 },
    { date: "May 12", shots: 2 },
    { date: "May 13", shots: 1 },
    { date: "May 14", shots: 3 },
  ],
  custom: [
    { date: "Custom Period 1", shots: 15 },
    { date: "Custom Period 2", shots: 12 },
    { date: "Custom Period 3", shots: 18 },
    { date: "Custom Period 4", shots: 10 },
  ],
};

const defaultData = dataByTimeRange["30d"];

const MachineUsageFrequency: React.FC<MachineUsageFrequencyProps> = ({
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
          <CardTitle>Usage Frequency</CardTitle>
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
        <CardTitle>Usage Frequency</CardTitle>
        <CardDescription>
          Number of shots pulled each day over the past two weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="shots"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Espresso Shots"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineUsageFrequency;
