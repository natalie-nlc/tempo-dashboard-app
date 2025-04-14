import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeviceEvent } from "./DeviceHistory";

interface DeviceEventCardProps {
  event: DeviceEvent;
}

const DeviceEventCard: React.FC<DeviceEventCardProps> = ({ event }) => {
  // Function to determine badge color based on event type
  const getBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case "brew":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "connection":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "update":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Function to get icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "brew":
        return "☕";
      case "maintenance":
        return "🔧";
      case "error":
        return "⚠️";
      case "connection":
        return "🔌";
      case "update":
        return "🔄";
      default:
        return "📋";
    }
  };

  return (
    <Card
      className="mb-4 overflow-hidden border-l-4 hover:shadow-md transition-shadow"
      style={{
        borderLeftColor:
          event.eventType === "brew"
            ? "#3b82f6"
            : event.eventType === "maintenance"
              ? "#eab308"
              : event.eventType === "error"
                ? "#ef4444"
                : event.eventType === "connection"
                  ? "#22c55e"
                  : event.eventType === "update"
                    ? "#a855f7"
                    : "#6b7280",
      }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="text-xl" aria-hidden="true">
              {getEventIcon(event.eventType)}
            </span>
            <Badge className={`${getBadgeVariant(event.eventType)}`}>
              {event.eventType}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(event.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-medium">{event.description}</h3>
          {event.details && Object.keys(event.details).length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              {Object.entries(event.details).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium mr-2">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceEventCard;
