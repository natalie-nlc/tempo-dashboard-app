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
} from "recharts";

interface MachineUsageByTimeProps {
  data?: Array<{
    hour: string;
    shots: number;
  }>;
  isLoading?: boolean;
}

const defaultData = [
  { hour: "6AM", shots: 2 },
  { hour: "7AM", shots: 4 },
  { hour: "8AM", shots: 5 },
  { hour: "9AM", shots: 3 },
  { hour: "10AM", shots: 1 },
  { hour: "11AM", shots: 0 },
  { hour: "12PM", shots: 2 },
  { hour: "1PM", shots: 1 },
  { hour: "2PM", shots: 0 },
  { hour: "3PM", shots: 1 },
  { hour: "4PM", shots: 2 },
  { hour: "5PM", shots: 3 },
  { hour: "6PM", shots: 1 },
];

const MachineUsageByTime: React.FC<MachineUsageByTimeProps> = ({
  data = defaultData,
  isLoading = false,
}) => {
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
          Number of espresso shots pulled throughout the day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} tickLine={false} />
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
              <Bar
                dataKey="shots"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                name="Espresso Shots"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineUsageByTime;
