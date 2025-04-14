import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export interface FilterValues {
  eventId: string;
  deviceId: string;
  username: string;
  roastId: string;
  recipeId: string;
}

interface FilterSectionProps {
  onApplyFilters: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  onApplyFilters,
  initialFilters = {
    eventId: "",
    deviceId: "",
    username: "",
    roastId: "",
    recipeId: "",
  },
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="w-full bg-background mb-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex flex-col w-[200px]">
          <label className="text-sm font-medium mb-1">Event ID</label>
          <Input
            placeholder="Filter by Event ID"
            value={filters.eventId}
            onChange={(e) => handleInputChange("eventId", e.target.value)}
          />
        </div>

        <div className="flex flex-col w-[200px]">
          <label className="text-sm font-medium mb-1">Device ID</label>
          <Input
            placeholder="Filter by Device ID"
            value={filters.deviceId}
            onChange={(e) => handleInputChange("deviceId", e.target.value)}
          />
        </div>

        <div className="flex flex-col w-[200px]">
          <label className="text-sm font-medium mb-1">Username</label>
          <Input
            placeholder="Filter by Username"
            value={filters.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
        </div>

        <div className="flex flex-col w-[200px]">
          <label className="text-sm font-medium mb-1">Roast ID</label>
          <Input
            placeholder="Filter by Roast ID"
            value={filters.roastId}
            onChange={(e) => handleInputChange("roastId", e.target.value)}
          />
        </div>

        <div className="flex flex-col w-[200px]">
          <label className="text-sm font-medium mb-1">Recipe ID</label>
          <Input
            placeholder="Filter by Recipe ID"
            value={filters.recipeId}
            onChange={(e) => handleInputChange("recipeId", e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleApplyFilters}
            variant="default"
            className="flex items-center gap-1 h-10"
          >
            <Filter className="h-4 w-4" />
            <span>Apply Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
