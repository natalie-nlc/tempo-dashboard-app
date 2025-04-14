import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, Coffee, Cog, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DeviceStatus {
  id: string;
  name: string;
  type: "brewer" | "grinder";
  status: "online" | "offline" | "maintenance" | "warning";
  lastActive: string;
  usagePercentage: number;
  maintenanceStatus: number;
  alerts: number;
  location: string;
}

interface DeviceStatusGridProps {
  devices?: DeviceStatus[];
  isLoading?: boolean;
}

const DeviceStatusGrid: React.FC<DeviceStatusGridProps> = ({
  devices = mockDevices,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  const getStatusColor = (status: DeviceStatus["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "maintenance":
        return "bg-yellow-500";
      case "warning":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: DeviceStatus["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "maintenance":
        return "Maintenance";
      case "warning":
        return "Warning";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (status: DeviceStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <Info className="h-4 w-4 text-gray-500" />;
      case "maintenance":
        return <Cog className="h-4 w-4 text-yellow-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (type: DeviceStatus["type"]) => {
    switch (type) {
      case "brewer":
        return <Coffee className="h-5 w-5" />;
      case "grinder":
        return <Cog className="h-5 w-5" />;
      default:
        return <Coffee className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-background p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="h-48 animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card
            key={device.id}
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4"
            style={{
              borderLeftColor: getStatusColor(device.status).replace("bg-", ""),
            }}
            onClick={() => handleDeviceClick(device.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="mr-2">{getDeviceIcon(device.type)}</div>
                  <div>
                    <h3 className="font-medium text-lg">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {device.location}
                    </p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={
                          device.status === "online" ? "default" : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(device.status)}
                        <span>{getStatusText(device.status)}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last active: {device.lastActive}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Usage</span>
                    <span>{device.usagePercentage}%</span>
                  </div>
                  <Progress value={device.usagePercentage} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Maintenance</span>
                    <span>{device.maintenanceStatus}%</span>
                  </div>
                  <Progress
                    value={device.maintenanceStatus}
                    className="h-2"
                    // Apply color based on maintenance status
                    style={
                      {
                        "--progress-background":
                          device.maintenanceStatus > 70
                            ? "rgb(239 68 68)"
                            : device.maintenanceStatus > 40
                              ? "rgb(234 179 8)"
                              : "rgb(34 197 94)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>

              {device.alerts > 0 && (
                <div className="mt-3 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">
                    {device.alerts} {device.alerts === 1 ? "alert" : "alerts"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mock data for development
const mockDevices: DeviceStatus[] = [
  {
    id: "1",
    name: "Brewer #A1201",
    type: "brewer",
    status: "online",
    lastActive: "2 minutes ago",
    usagePercentage: 78,
    maintenanceStatus: 25,
    alerts: 0,
    location: "Kitchen Demo Room",
  },
  {
    id: "2",
    name: "Grinder #G3405",
    type: "grinder",
    status: "warning",
    lastActive: "15 minutes ago",
    usagePercentage: 92,
    maintenanceStatus: 85,
    alerts: 2,
    location: "Coffee Lab",
  },
  {
    id: "3",
    name: "Brewer #A1305",
    type: "brewer",
    status: "maintenance",
    lastActive: "1 hour ago",
    usagePercentage: 45,
    maintenanceStatus: 60,
    alerts: 1,
    location: "Break Room",
  },
  {
    id: "4",
    name: "Grinder #G2201",
    type: "grinder",
    status: "offline",
    lastActive: "2 days ago",
    usagePercentage: 0,
    maintenanceStatus: 30,
    alerts: 0,
    location: "Storage",
  },
  {
    id: "5",
    name: "Brewer #A1422",
    type: "brewer",
    status: "online",
    lastActive: "5 minutes ago",
    usagePercentage: 65,
    maintenanceStatus: 15,
    alerts: 0,
    location: "Main Office",
  },
  {
    id: "6",
    name: "Grinder #G4102",
    type: "grinder",
    status: "online",
    lastActive: "1 minute ago",
    usagePercentage: 82,
    maintenanceStatus: 45,
    alerts: 0,
    location: "Showroom",
  },
  {
    id: "7",
    name: "Brewer #A1508",
    type: "brewer",
    status: "warning",
    lastActive: "30 minutes ago",
    usagePercentage: 90,
    maintenanceStatus: 75,
    alerts: 1,
    location: "Test Lab",
  },
  {
    id: "8",
    name: "Grinder #G3901",
    type: "grinder",
    status: "maintenance",
    lastActive: "3 hours ago",
    usagePercentage: 20,
    maintenanceStatus: 90,
    alerts: 3,
    location: "R&D Department",
  },
];

export default DeviceStatusGrid;
