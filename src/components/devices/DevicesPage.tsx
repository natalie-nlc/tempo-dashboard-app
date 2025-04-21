import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DevicesMap from "./DevicesMap";
import DeviceTable from "./DeviceTable";
import DeviceStatusGrid from "../dashboard/DeviceStatusGrid";

interface DevicesPageProps {}

const DevicesPage: React.FC<DevicesPageProps> = () => {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
          <CardDescription>
            View and filter all devices in your ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceTable />
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Device Locations</CardTitle>
          <CardDescription>
            Geographic distribution of all connected devices in your ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[600px]">
          <DevicesMap />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Prototype Statuses</CardTitle>
          <CardDescription>
            Current status of all connected prototype devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceStatusGrid />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesPage;
