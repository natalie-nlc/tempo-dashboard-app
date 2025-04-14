import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DeviceEvent {
  id: string;
  deviceId: string;
  eventType:
    | "brew"
    | "grind"
    | "maintenance"
    | "error"
    | "connection"
    | "update";
  timestamp: string; // ISO date string
  description: string;
  details?: Record<string, any>;
}

interface DeviceHistoryProps {
  events: DeviceEvent[];
  isLoading?: boolean;
}

const DeviceHistory: React.FC<DeviceHistoryProps> = ({
  events = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="p-4">Loading event history...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                No events found for this device.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  {new Date(event.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      event.eventType === "brew"
                        ? "bg-blue-100 text-blue-800"
                        : event.eventType === "grind"
                          ? "bg-purple-100 text-purple-800"
                          : event.eventType === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : event.eventType === "error"
                              ? "bg-red-100 text-red-800"
                              : event.eventType === "connection"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.eventType}
                  </div>
                </TableCell>
                <TableCell>{event.description}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeviceHistory;
