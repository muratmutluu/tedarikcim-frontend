"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { useMonthlyTransactionsAverage } from "@/hooks/dashboard/use-monthly-transactions-average";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CardSkeleton } from "@/components/card-skeleton";

const chartConfig = {
  avgTotalAmount: {
    label: "Ort. Satış",
    color: "var(--chart-1)",
  },
  avgReceivedAmount: {
    label: "Ort. Ödeme",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DashboardBarChart() {
  const [selectedYear, setSelectedYear] = React.useState<"before-last" | "last" | "current">(
    "current"
  );

  const yearNumber =
    selectedYear === "current"
      ? new Date().getFullYear()
      : selectedYear === "last"
      ? new Date().getFullYear() - 1
      : new Date().getFullYear() - 2;

  const { data: transactions = [], isLoading, isError } = useMonthlyTransactionsAverage(yearNumber);

  const chartData = React.useMemo(() => {
    return transactions.map((item) => ({
      month: item.month,
      avgTotalAmount: item.avgTotalAmount,
      avgReceivedAmount: item.avgReceivedAmount,
    }));
  }, [transactions]);

  if (isLoading) {
    return <CardSkeleton contentClassName="h-[250px]" />;
  }

  if (isError) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }

  return (
    <Card className="@container/card justify-between">
      <CardHeader className="relative">
        <CardTitle>Aylara Göre Ortalama Müşteri İşlemleri</CardTitle>
        <CardDescription>{yearNumber} yılı</CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={selectedYear}
            onValueChange={(value) =>
              value && setSelectedYear(value as "before-last" | "last" | "current")
            }
            variant="outline"
          >
            <ToggleGroupItem value="before-last" className="h-8 px-3">
              Evvelsi Yıl
            </ToggleGroupItem>
            <ToggleGroupItem value="last" className="h-8 px-3">
              Geçen Yıl
            </ToggleGroupItem>
            <ToggleGroupItem value="current" className="h-8 px-3">
              Bu Yıl
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(2024, (value as number) - 1); // 2024 sadece dummy yıl
                return date.toLocaleDateString("tr-TR", { month: "short" });
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="avgTotalAmount" fill="var(--chart-1)" radius={4} />
            <Bar dataKey="avgReceivedAmount" fill="var(--chart-2)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
