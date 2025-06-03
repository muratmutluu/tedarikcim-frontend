"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMonthlyTransactionsAverage } from "@/hooks/dashboard/use-monthly-transactions-average";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CardSkeleton } from "@/components/card-skeleton";
import { useMonthlyTransactionsTotal } from "@/hooks/dashboard/use-monthly-transactions-total";

const chartConfig = {
  // Ortalama için
  totalAmount: {
    label: "Satış",
    color: "var(--chart-1)",
  },
  receivedAmount: {
    label: "Ödeme",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DashboardBarChart() {
  const [selectedYear, setSelectedYear] = React.useState<"before-last" | "last" | "current">(
    "current"
  );
  const [viewType, setViewType] = React.useState<"average" | "total">("average");

  const yearNumber =
    selectedYear === "current"
      ? new Date().getFullYear()
      : selectedYear === "last"
      ? new Date().getFullYear() - 1
      : new Date().getFullYear() - 2;

  const {
    data: avgTransactions = [],
    isLoading: isAvgLoading,
    isError: isAvgError,
  } = useMonthlyTransactionsAverage(yearNumber);

  const {
    data: totalTransactions = [],
    isLoading: isTotalLoading,
    isError: isTotalError,
  } = useMonthlyTransactionsTotal(yearNumber);

  const isLoading = isAvgLoading || isTotalLoading;
  const isError = isAvgError || isTotalError;

  const chartData = React.useMemo(() => {
    if (viewType === "average") {
      return avgTransactions.map((item) => ({
        month: item.month,
        totalAmount: item.avgTotalAmount,
        receivedAmount: item.avgReceivedAmount,
      }));
    } else {
      // Debug için
      return totalTransactions.map((item) => ({
        month: item.month,
        totalAmount: item.totalAmount,
        receivedAmount: item.receivedAmount,
      }));
    }
  }, [avgTransactions, totalTransactions, viewType]);

  console.log("Chart Data:", chartData);

  if (isLoading) {
    return <CardSkeleton contentClassName="h-[250px]" />;
  }

  if (isError) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }

  return (
    <Card className="@container/card justify-between">
      <CardHeader className="relative">
        <CardTitle>
          Aylara Göre {viewType === "average" ? "Ortalama" : "Toplam"} Müşteri İşlemleri
        </CardTitle>
        <CardDescription>{yearNumber} yılı</CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          {/* Görünüm Tipi Toggle */}
          <ToggleGroup
            type="single"
            value={viewType}
            onValueChange={(value) => value && setViewType(value as "average" | "total")}
            variant="outline"
          >
            <ToggleGroupItem value="average" className="h-8 px-3">
              Ortalama
            </ToggleGroupItem>
            <ToggleGroupItem value="total" className="h-8 px-3">
              Toplam
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Yıl Toggle */}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="totalAmount" fill="var(--chart-1)" radius={4} />
            <Bar dataKey="receivedAmount" fill="var(--chart-2)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
