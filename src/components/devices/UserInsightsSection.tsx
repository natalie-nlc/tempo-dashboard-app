import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  accountCreated: string;
  lastActive: string;
  avatar?: string;
}

interface UserInsightsSectionProps {
  users?: UserData[];
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

const UserInsightsSection: React.FC<UserInsightsSectionProps> = ({
  users = mockUsers,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Connected Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-12 bg-gray-200 rounded-full w-12 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Connected Users</h3>
        <Badge variant="outline">{users.length} users</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-base font-medium">{user.name}</h4>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Account created:
                  </span>
                  <span className="font-medium">
                    {format(new Date(user.accountCreated), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last active:</span>
                  <span className="font-medium">
                    {format(new Date(user.lastActive), "MMM d, yyyy h:mm a")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mock data for development
const mockUsers: UserData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@coffeelab.com",
    role: "Barista",
    accountCreated: "2023-01-15T10:30:00Z",
    lastActive: "2023-06-14T08:45:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@coffeelab.com",
    role: "Manager",
    accountCreated: "2022-11-03T14:20:00Z",
    lastActive: "2023-06-15T11:30:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "e.rodriguez@coffeelab.com",
    role: "Technician",
    accountCreated: "2023-03-22T09:15:00Z",
    lastActive: "2023-06-12T16:20:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: "4",
    name: "David Kim",
    email: "d.kim@coffeelab.com",
    role: "Barista",
    accountCreated: "2023-02-08T11:45:00Z",
    lastActive: "2023-06-13T14:10:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "o.martinez@coffeelab.com",
    role: "Owner",
    accountCreated: "2022-09-17T08:30:00Z",
    lastActive: "2023-06-15T09:25:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
  },
];

export default UserInsightsSection;
