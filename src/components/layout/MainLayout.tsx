import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Coffee,
  Home,
  Database,
  Map,
  Settings,
  Search,
  Bell,
  Flask,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Determine active section based on current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.startsWith("/devices")) return "devices";
    if (path.startsWith("/data-explorer")) return "data-explorer";
    if (path.startsWith("/labs")) return "labs";
    if (path.startsWith("/settings")) return "settings";
    return "dashboard";
  };

  const activeSection = getActiveSection();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Coffee className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Machine Insights</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={activeSection === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </Link>
          </Button>

          <Button
            variant={activeSection === "devices" ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/devices">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span>Devices</span>
              </div>
            </Link>
          </Button>

          <div className="space-y-1">
            <Button
              variant={activeSection === "data-explorer" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/data-explorer">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>data-explorer</span>
                </div>
              </Link>
            </Button>

            {activeSection === "data-explorer" && (
              <div className="pl-6 space-y-1">
                <Button
                  variant={
                    location.pathname === "/data-explorer"
                      ? "secondary"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/data-explorer">
                    <span>Events</span>
                  </Link>
                </Button>

                <Button
                  variant={
                    location.pathname === "/data-explorer/alerts"
                      ? "secondary"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/data-explorer/alerts">
                    <span>Alerts & Errors</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Button
              variant={activeSection === "labs" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/labs/dyngg">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  <span>Labs</span>
                </div>
              </Link>
            </Button>

            {activeSection === "labs" && (
              <div className="pl-6 space-y-1">
                <Button
                  variant={
                    location.pathname === "/labs/dyngg" ? "secondary" : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/labs/dyngg">
                    <span>DynGG</span>
                  </Link>
                </Button>
                <Button
                  variant={
                    location.pathname === "/labs/engineering"
                      ? "secondary"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/labs/engineering">
                    <span>Engineering</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        <div className="pt-4 border-t">
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/settings">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">nunc.</h2>
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

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
