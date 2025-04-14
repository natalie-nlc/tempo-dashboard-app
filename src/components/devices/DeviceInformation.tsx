import React from "react";
import { Device } from "@/types/device";

interface DeviceInformationProps {
  device: Device;
}

const DeviceInformation: React.FC<DeviceInformationProps> = ({ device }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Device ID</p>
          <p className="font-mono">{device.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Serial Number</p>
          <p className="font-mono">{device.serialNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Model</p>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              device.model === "prototype"
                ? "bg-purple-100 text-purple-800"
                : device.model === "pre-series"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {device.model}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              device.status === "online"
                ? "bg-green-100 text-green-800"
                : device.status === "warning"
                  ? "bg-red-100 text-red-800"
                  : device.status === "maintenance"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {device.status}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p>{device.location}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Coordinates</p>
          <p className="font-mono">
            {device.coordinates[0]}, {device.coordinates[1]}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Customer Name</p>
          <p>{device.owner || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Last Connected</p>
          <p>{new Date(device.lastConnected).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Firmware Version</p>
          <p className="font-mono">{device.firmwareVersion}</p>
        </div>
      </div>
    </div>
  );
};

export default DeviceInformation;
