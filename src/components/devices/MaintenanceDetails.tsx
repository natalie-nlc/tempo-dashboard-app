import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Device } from "@/types/device";

interface MaintenanceDetailsProps {
  device: Device;
}

const MaintenanceDetails: React.FC<MaintenanceDetailsProps> = ({ device }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Maintenance Details</CardTitle>
        <CardDescription>
          Information about device maintenance history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Last Descaling</p>
            <p>
              {device.lastDescaling
                ? new Date(device.lastDescaling).toLocaleDateString()
                : "No record"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Last Filter Change
            </p>
            <p>
              {device.lastFilterChange
                ? new Date(device.lastFilterChange).toLocaleDateString()
                : "No record"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Next Scheduled Maintenance
            </p>
            <p>
              {device.lastDescaling
                ? new Date(
                    new Date(device.lastDescaling).getTime() +
                      90 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()
                : "Not scheduled"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Maintenance Status
            </p>
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                !device.lastDescaling
                  ? "bg-red-100 text-red-800"
                  : new Date(device.lastDescaling).getTime() +
                        90 * 24 * 60 * 60 * 1000 <
                      Date.now()
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {!device.lastDescaling
                ? "Never Serviced"
                : new Date(device.lastDescaling).getTime() +
                      90 * 24 * 60 * 60 * 1000 <
                    Date.now()
                  ? "Service Due"
                  : "Good Standing"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceDetails;
