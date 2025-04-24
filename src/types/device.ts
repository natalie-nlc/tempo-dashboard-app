export type DeviceStatus = "online" | "offline" | "maintenance" | "warning";

export type DeviceModel = "prototype" | "pre-series" | "production";

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  model: DeviceModel;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  lastConnected: string; // ISO date string
  owner?: string; // Username of the device owner
  serialNumber: string;
  firmwareVersion: string;
  purchaseDate?: string; // ISO date string
  shipDate?: string; // ISO date string
  lastDescaling?: string; // ISO date string
  lastFilterChange?: string; // ISO date string
}
