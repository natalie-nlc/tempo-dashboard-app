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

interface DevicesPageProps {}

const DevicesPage: React.FC<DevicesPageProps> = () => {
  return (
    <div className="space-y-6">
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
          <CardTitle>Device Management</CardTitle>
          <CardDescription>
            View and filter all devices in your ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesPage;
