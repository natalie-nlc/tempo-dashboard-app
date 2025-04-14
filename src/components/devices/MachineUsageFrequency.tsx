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

interface MachineUsageFrequencyProps {
  data?: Array<{
    date: string;
    shots: number;
  }>;
  isLoading?: boolean;
}

const defaultData = [
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
];

const MachineUsageFrequency: React.FC<MachineUsageFrequencyProps> = ({
  data = defaultData,
  isLoading = false,
}) => {
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
            <LineChart data={data}>
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
