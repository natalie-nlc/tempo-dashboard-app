import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type TimeRangeValue =
  | "30m"
  | "1h"
  | "4h"
  | "8h"
  | "24h"
  | "3d"
  | "7d"
  | "30d"
  | "90d"
  | "custom";

interface TimeRangeFilterProps {
  value: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
  className?: string;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [customStartDate, setCustomStartDate] = React.useState<string>("");
  const [customEndDate, setCustomEndDate] = React.useState<string>("");

  const handleApplyCustomRange = () => {
    // In a real application, this would pass the custom date range to the parent
    console.log("Custom range applied:", {
      start: customStartDate,
      end: customEndDate,
    });
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30m">Past 30 minutes</SelectItem>
          <SelectItem value="1h">Past 1 hour</SelectItem>
          <SelectItem value="4h">Past 4 hours</SelectItem>
          <SelectItem value="8h">Past 8 hours</SelectItem>
          <SelectItem value="24h">Past 24 hours</SelectItem>
          <SelectItem value="3d">Past 3 days</SelectItem>
          <SelectItem value="7d">Past 7 days</SelectItem>
          <SelectItem value="30d">Past 30 days</SelectItem>
          <SelectItem value="90d">Past 90 days</SelectItem>
          <SelectItem value="custom">Custom Range...</SelectItem>
        </SelectContent>
      </Select>

      {value === "custom" && (
        <div className="flex items-center space-x-2">
          <input
            type="datetime-local"
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="datetime-local"
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
          <Button size="sm" variant="outline" onClick={handleApplyCustomRange}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeRangeFilter;
