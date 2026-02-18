"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

const kpis = [
  {
    title: "Total Revenue",
    value: "$124,563.00",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ShoppingCart,
    description: "vs last month",
  },
  {
    title: "Total Customers",
    value: "5,678",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Total Products",
    value: "892",
    change: "+3.1%",
    changeType: "positive" as const,
    icon: Package,
    description: "vs last month",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center space-x-2 text-sm">
              {kpi.changeType === "positive" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={
                  kpi.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {kpi.change}
              </span>
              <span className="text-muted-foreground">{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
