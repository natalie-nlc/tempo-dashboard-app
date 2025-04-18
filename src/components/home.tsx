import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardOverview from "./dashboard/DashboardOverview";
import AlertNotifications from "./dashboard/AlertNotifications";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Espresso Shots Today
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
            <CardTitle className="text-sm font-medium">Shot Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.2%</div>
            <p className="text-xs text-muted-foreground">
              % shots using dynGG that had a peak pressure between 6 and 9 bars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total nunc. Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active nunc. Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">224</div>
            <p className="text-xs text-muted-foreground">90.3% of total</p>
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
  );
}
