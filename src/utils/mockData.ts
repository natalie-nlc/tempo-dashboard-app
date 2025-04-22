import { BrewEvent } from "@/components/data-explorer/DataTable";

/**
 * Generates an array of sensor readings with gradual changes
 * @param length The number of readings to generate
 * @param min The minimum value
 * @param max The maximum value
 * @param pattern The pattern of the readings ('stable', 'rising', 'peak')
 * @returns An array of sensor readings
 */
export const generateSensorReadings = (
  length: number,
  min: number,
  max: number,
  pattern: "stable" | "rising" | "peak",
): number[] => {
  const readings: number[] = [];

  switch (pattern) {
    case "stable":
      // Generate stable values with small fluctuations
      const baseValue = min + Math.random() * (max - min);
      for (let i = 0; i < length; i++) {
        const fluctuation = (Math.random() - 0.5) * 3;
        readings.push(parseFloat((baseValue + fluctuation).toFixed(2)));
      }
      break;

    case "rising":
      // Generate values that start at min and rise to max
      for (let i = 0; i < length; i++) {
        const progress = i / (length - 1);
        const value = min + progress * (max - min);
        const fluctuation = (Math.random() - 0.5) * 2;
        readings.push(parseFloat((value + fluctuation).toFixed(2)));
      }
      break;

    case "peak":
      // Generate values that start at min, rise to max, and fall back to min
      for (let i = 0; i < length; i++) {
        const progress = i / (length - 1);
        let value;
        if (progress < 0.5) {
          // Rising phase
          value = min + progress * 2 * (max - min);
        } else {
          // Falling phase
          value = max - (progress - 0.5) * 2 * (max - min);
        }
        const fluctuation = (Math.random() - 0.5) * 3;
        readings.push(parseFloat((value + fluctuation).toFixed(2)));
      }
      break;
  }

  return readings;
};

/**
 * Generates mock brew event data
 * @returns An array of mock brew events
 */
export const generateMockBrewEvents = (): BrewEvent[] => {
  return [
    {
      eventId: "3465921786324",
      deviceId: "56098276526738773",
      username: "Natalie",
      roastId: "004",
      recipeId: "21",
      timestamp: "2023-06-15 08:26:22",
      peakPressure: 6.2,
      consumableId: 1001,
      roastDate: "01/06/2023",
      consumableOpenDays: 14,
      model: "prototype",
      totalDoseWeight: 18.2,
      brewDuration: 65,
      brewerHeadTemp: generateSensorReadings(200, 80, 95, "stable"),
      flowPump1: generateSensorReadings(200, 0, 85, "peak"),
      fthHeater1: generateSensorReadings(200, 80, 95, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 90, "peak"),
      volumePump1: generateSensorReadings(200, 0, 85, "rising"),
    },
    {
      eventId: "3465921786325",
      deviceId: "56098276526738773",
      username: "Natalie",
      roastId: "002",
      recipeId: "31",
      timestamp: "2023-06-15 07:45:10",
      peakPressure: 10.2,
      consumableId: 1002,
      roastDate: "02/06/2023",
      consumableOpenDays: 13,
      model: "pre-series",
      totalDoseWeight: 18.7,
      brewDuration: 72,
      brewerHeadTemp: generateSensorReadings(200, 80, 95, "stable"),
      flowPump1: generateSensorReadings(200, 0, 95, "peak"),
      fthHeater1: generateSensorReadings(200, 80, 95, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 85, "peak"),
      volumePump1: generateSensorReadings(200, 0, 89, "rising"),
    },
    {
      eventId: "3245645342578",
      deviceId: "783698v9876797",
      username: "Sneha",
      roastId: "004",
      recipeId: "21",
      timestamp: "2023-06-14 14:22:05",
      peakPressure: 7.9,
      consumableId: 1003,
      roastDate: "28/05/2023",
      consumableOpenDays: 17,
      model: "v0",
      totalDoseWeight: 18.0,
      brewDuration: 58,
      brewerHeadTemp: generateSensorReadings(200, 80, 95, "stable"),
      flowPump1: generateSensorReadings(200, 0, 75, "peak"),
      fthHeater1: generateSensorReadings(200, 80, 95, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 65, "peak"),
      volumePump1: generateSensorReadings(200, 0, 78, "rising"),
    },
    {
      eventId: "9876543210123",
      deviceId: "45678912345678",
      username: "Marco",
      roastId: "007",
      recipeId: "15",
      timestamp: "2023-06-14 09:15:30",
      peakPressure: 8.5,
      consumableId: 1004,
      roastDate: "30/05/2023",
      consumableOpenDays: 15,
      model: "prototype",
      totalDoseWeight: 19.0,
      brewDuration: 62,
      brewerHeadTemp: generateSensorReadings(200, 82, 93, "stable"),
      flowPump1: generateSensorReadings(200, 0, 80, "peak"),
      fthHeater1: generateSensorReadings(200, 82, 93, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 75, "peak"),
      volumePump1: generateSensorReadings(200, 0, 82, "rising"),
    },
    {
      eventId: "1234567890123",
      deviceId: "98765432109876",
      username: "Elena",
      roastId: "005",
      recipeId: "18",
      timestamp: "2023-06-13 16:45:12",
      peakPressure: 9.1,
      consumableId: 1005,
      roastDate: "29/05/2023",
      consumableOpenDays: 16,
      model: "pre-series",
      totalDoseWeight: 18.5,
      brewDuration: 68,
      brewerHeadTemp: generateSensorReadings(200, 81, 94, "stable"),
      flowPump1: generateSensorReadings(200, 0, 88, "peak"),
      fthHeater1: generateSensorReadings(200, 81, 94, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 80, "peak"),
      volumePump1: generateSensorReadings(200, 0, 84, "rising"),
    },
    {
      eventId: "5432109876543",
      deviceId: "12345678901234",
      username: "David",
      roastId: "003",
      recipeId: "25",
      timestamp: "2023-06-13 11:30:45",
      peakPressure: 7.5,
      consumableId: 1006,
      roastDate: "27/05/2023",
      consumableOpenDays: 18,
      model: "v0",
      totalDoseWeight: 17.8,
      brewDuration: 60,
      brewerHeadTemp: generateSensorReadings(200, 79, 96, "stable"),
      flowPump1: generateSensorReadings(200, 0, 78, "peak"),
      fthHeater1: generateSensorReadings(200, 79, 96, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 70, "peak"),
      volumePump1: generateSensorReadings(200, 0, 76, "rising"),
    },
    {
      eventId: "6789012345678",
      deviceId: "56098276526738773",
      username: "Natalie",
      roastId: "006",
      recipeId: "22",
      timestamp: "2023-06-12 15:20:18",
      peakPressure: 6.8,
      consumableId: 1007,
      roastDate: "03/06/2023",
      consumableOpenDays: 9,
      model: "prototype",
      totalDoseWeight: 18.3,
      brewDuration: 64,
      brewerHeadTemp: generateSensorReadings(200, 80, 95, "stable"),
      flowPump1: generateSensorReadings(200, 0, 83, "peak"),
      fthHeater1: generateSensorReadings(200, 80, 95, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 88, "peak"),
      volumePump1: generateSensorReadings(200, 0, 83, "rising"),
    },
    {
      eventId: "2345678901234",
      deviceId: "783698v9876797",
      username: "Sneha",
      roastId: "001",
      recipeId: "19",
      timestamp: "2023-06-12 10:05:33",
      peakPressure: 9.7,
      consumableId: 1008,
      roastDate: "26/05/2023",
      consumableOpenDays: 17,
      model: "pre-series",
      totalDoseWeight: 19.2,
      brewDuration: 70,
      brewerHeadTemp: generateSensorReadings(200, 82, 94, "stable"),
      flowPump1: generateSensorReadings(200, 0, 92, "peak"),
      fthHeater1: generateSensorReadings(200, 82, 94, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 82, "peak"),
      volumePump1: generateSensorReadings(200, 0, 87, "rising"),
    },
    {
      eventId: "8901234567890",
      deviceId: "45678912345678",
      username: "Marco",
      roastId: "008",
      recipeId: "27",
      timestamp: "2023-06-11 17:40:55",
      peakPressure: 8.2,
      consumableId: 1009,
      roastDate: "04/06/2023",
      consumableOpenDays: 7,
      model: "v0",
      totalDoseWeight: 18.1,
      brewDuration: 63,
      brewerHeadTemp: generateSensorReadings(200, 81, 93, "stable"),
      flowPump1: generateSensorReadings(200, 0, 79, "peak"),
      fthHeater1: generateSensorReadings(200, 81, 93, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 72, "peak"),
      volumePump1: generateSensorReadings(200, 0, 80, "rising"),
    },
    {
      eventId: "4567890123456",
      deviceId: "98765432109876",
      username: "Elena",
      roastId: "009",
      recipeId: "30",
      timestamp: "2023-06-11 08:55:40",
      peakPressure: 7.0,
      consumableId: 1010,
      roastDate: "25/05/2023",
      consumableOpenDays: 17,
      model: "prototype",
      totalDoseWeight: 17.9,
      brewDuration: 61,
      brewerHeadTemp: generateSensorReadings(200, 80, 96, "stable"),
      flowPump1: generateSensorReadings(200, 0, 81, "peak"),
      fthHeater1: generateSensorReadings(200, 80, 96, "stable"),
      pressureCircuit1: generateSensorReadings(200, 0, 68, "peak"),
      volumePump1: generateSensorReadings(200, 0, 79, "rising"),
    },
  ];
};
