import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  message: string;
  priority: "critical" | "warning" | "info";
  timestamp: Date;
  resolved: boolean;
}

interface AlertNotificationsProps {
  alerts?: Alert[];
  onResolveAlert?: (alertId: string) => void;
  onConfigureAlerts?: () => void;
}

const AlertNotifications = ({
  alerts = [
    {
      id: "1",
      deviceId: "ESP-001",
      deviceName: "Brewer Alpha",
      message: "Water temperature fluctuation detected",
      priority: "critical",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      resolved: false,
    },
    {
      id: "2",
      deviceId: "GRD-002",
      deviceName: "Grinder Beta",
      message: "Burr wear detected, maintenance required",
      priority: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      resolved: false,
    },
    {
      id: "3",
      deviceId: "ESP-003",
      deviceName: "Brewer Gamma",
      message: "Pressure pump performance degrading",
      priority: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
      resolved: false,
    },
    {
      id: "4",
      deviceId: "ESP-004",
      deviceName: "Brewer Delta",
      message: "Scheduled maintenance due",
      priority: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      resolved: false,
    },
    {
      id: "5",
      deviceId: "GRD-005",
      deviceName: "Grinder Epsilon",
      message: "Motor overheating detected",
      priority: "critical",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      resolved: false,
    },
  ],
  onResolveAlert = () => {},
  onConfigureAlerts = () => {},
}: AlertNotificationsProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "time">("priority");
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);

  const handleResolveAlert = (alertId: string) => {
    setResolvedAlerts([...resolvedAlerts, alertId]);
    onResolveAlert(alertId);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return !resolvedAlerts.includes(alert.id);
    if (activeTab === "critical")
      return (
        alert.priority === "critical" && !resolvedAlerts.includes(alert.id)
      );
    if (activeTab === "warning")
      return alert.priority === "warning" && !resolvedAlerts.includes(alert.id);
    if (activeTab === "info")
      return alert.priority === "info" && !resolvedAlerts.includes(alert.id);
    if (activeTab === "resolved") return resolvedAlerts.includes(alert.id);
    return true;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { critical: 0, warning: 1, info: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "secondary";
      default:
        return "default";
    }
  };

  const alertCount = alerts.filter(
    (alert) => !resolvedAlerts.includes(alert.id),
  ).length;
  const criticalCount = alerts.filter(
    (alert) =>
      alert.priority === "critical" && !resolvedAlerts.includes(alert.id),
  ).length;

  return (
    <Card className="h-full bg-background shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Alerts</CardTitle>
          <Badge variant="destructive" className="ml-2">
            {alertCount}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Sort alerts</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("priority")}>
                Sort by Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("time")}>
                Sort by Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onConfigureAlerts}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configure alerts</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b px-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                All
                <Badge variant="outline" className="ml-1">
                  {alertCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">
                Critical
                <Badge variant="destructive" className="ml-1">
                  {criticalCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">
                Warning
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs">
                Info
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs">
                Resolved
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <AlertList
              alerts={sortedAlerts}
              onResolve={handleResolveAlert}
              formatTime={formatTime}
              getPriorityColor={getPriorityColor}
              resolvedAlerts={resolvedAlerts}
            />
          </TabsContent>
          <TabsContent value="critical" className="m-0">
            <AlertList
              alerts={sortedAlerts}
              onResolve={handleResolveAlert}
              formatTime={formatTime}
              getPriorityColor={getPriorityColor}
              resolvedAlerts={resolvedAlerts}
            />
          </TabsContent>
          <TabsContent value="warning" className="m-0">
            <AlertList
              alerts={sortedAlerts}
              onResolve={handleResolveAlert}
              formatTime={formatTime}
              getPriorityColor={getPriorityColor}
              resolvedAlerts={resolvedAlerts}
            />
          </TabsContent>
          <TabsContent value="info" className="m-0">
            <AlertList
              alerts={sortedAlerts}
              onResolve={handleResolveAlert}
              formatTime={formatTime}
              getPriorityColor={getPriorityColor}
              resolvedAlerts={resolvedAlerts}
            />
          </TabsContent>
          <TabsContent value="resolved" className="m-0">
            <AlertList
              alerts={sortedAlerts}
              onResolve={handleResolveAlert}
              formatTime={formatTime}
              getPriorityColor={getPriorityColor}
              resolvedAlerts={resolvedAlerts}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface AlertListProps {
  alerts: Alert[];
  onResolve: (id: string) => void;
  formatTime: (date: Date) => string;
  getPriorityColor: (priority: string) => string;
  resolvedAlerts: string[];
}

const AlertList = ({
  alerts,
  onResolve,
  formatTime,
  getPriorityColor,
  resolvedAlerts,
}: AlertListProps) => {
  if (alerts.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">No alerts to display</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1 p-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start justify-between rounded-md p-3 transition-colors ${resolvedAlerts.includes(alert.id) ? "bg-muted/50" : "hover:bg-muted/50"}`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {alert.priority === "critical" ? (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                ) : alert.priority === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                ) : (
                  <Bell className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium">{alert.deviceName}</h4>
                  <Badge
                    variant={getPriorityColor(alert.priority) as any}
                    className="text-[10px]"
                  >
                    {alert.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.message}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {alert.deviceId}
                  </span>
                </div>
              </div>
            </div>
            {!resolvedAlerts.includes(alert.id) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onResolve(alert.id)}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">Resolve</span>
              </Button>
            )}
            {resolvedAlerts.includes(alert.id) && (
              <span className="text-xs text-muted-foreground">Resolved</span>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AlertNotifications;
