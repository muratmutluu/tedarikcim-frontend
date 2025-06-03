"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CardSkeleton } from "@/components/card-skeleton";
import { useCustomerStats } from "@/hooks/customers/use-customer-stats";
import React from "react";

export const description = "A donut chart";

const chartConfig = {
  totalAmount: {
    label: "Toplam Satış",
    color: "var(--chart-1)",
  },
  receivedAmount: {
    label: "Toplam Ödeme",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CustomerPieChart({ customerId }: { customerId: number }) {
  const { data: stats, isLoading, isError } = useCustomerStats(customerId);

  const chartData = React.useMemo(() => {
    if (!stats) return [];
    return [
      {
        category: "Satış",
        amount: stats.totalAmount,
        fill: chartConfig.totalAmount.color,
      },
      {
        category: "Ödeme",
        amount: stats.receivedAmount,
        fill: chartConfig.receivedAmount.color,
      },
    ];
  }, [stats]);

  if (isLoading) {
    return <CardSkeleton contentClassName="h-[250px]" />;
  }

  if (isError || !stats) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Toplam Satış ve Ödeme</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" nameKey="category" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
