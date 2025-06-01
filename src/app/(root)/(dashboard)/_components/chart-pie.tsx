"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTopCustomersByBalance } from "@/hooks/customers/use-top-customers-by-balance";

export function ChartPie() {
  const { data: customers = [], isLoading, isError } = useTopCustomersByBalance(5);

  const chartData = customers.map((customer, index) => ({
    name: customer.name,
    balance: customer.balance,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = {
    balance: { label: "Bakiye" },
  } satisfies ChartConfig;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Bakiyesi En Yüksek 10 Müşteri</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="balance" nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
