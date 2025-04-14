import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Coffee,
  Settings,
  Bell,
  Search,
  Home,
  Database,
  Map,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardOverview from "./dashboard/DashboardOverview";
import AlertNotifications from "./dashboard/AlertNotifications";
import DataTable from "./data-explorer/DataTable";
import DevicesPage from "./devices/DevicesPage";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Coffee className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Nunc. Monitoring</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={activeSection === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("dashboard")}
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </Button>

          <Button
            variant={activeSection === "devices" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("devices")}
          >
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span>Devices</span>
            </div>
          </Button>

          <Button
            variant={activeSection === "data-explorer" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("data-explorer")}
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Data Explorer</span>
            </div>
          </Button>

          <Button
            variant={activeSection === "analytics" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("analytics")}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </div>
          </Button>
        </nav>

        <div className="pt-4 border-t">
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("settings")}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Ecosystem Dashboard</h2>
            <Tabs defaultValue="overview" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                3
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <span className="text-xs font-medium">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">248</div>
                    <p className="text-xs text-muted-foreground">
                      +12 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">224</div>
                    <p className="text-xs text-muted-foreground">
                      90.3% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Brews Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,842</div>
                    <p className="text-xs text-muted-foreground">
                      +8.2% from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">
                      3 critical, 4 warnings
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <DashboardOverview />
                </div>
                <div>
                  <AlertNotifications />
                </div>
              </div>
            </div>
          )}

          {activeSection === "data-explorer" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Explorer</CardTitle>
                  <CardDescription>
                    Search, filter, and analyze brew and grind events across all
                    devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable />
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "devices" && <DevicesPage />}

          {activeSection === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed performance analysis across all devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Performance analytics content will be displayed here.</p>
              </CardContent>
            </Card>
          )}

          {activeSection === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system preferences and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings content will be displayed here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
