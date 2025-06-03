"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCustomerMonthlyTransactionsTotal } from "@/hooks/customers/use-customer-stats";
import React from "react";
import { CardSkeleton } from "@/components/card-skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  totalAmount: {
    label: "Toplam Satış",
    color: "var(--chart-3)",
  },
  receivedAmount: {
    label: "Toplam Ödeme",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function CustomerBarChartStacked({ customerId }: { customerId: number }) {
  const [selectedYear, setSelectedYear] = React.useState<"before-last" | "last" | "current">(
    "current"
  );

  const yearNumber =
    selectedYear === "current"
      ? new Date().getFullYear()
      : selectedYear === "last"
      ? new Date().getFullYear() - 1
      : new Date().getFullYear() - 2;

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useCustomerMonthlyTransactionsTotal(customerId, yearNumber);

  const chartData = React.useMemo(() => {
    return transactions.map((item) => ({
      month: item.month,
      totalAmount: item.totalAmount,
      receivedAmount: item.receivedAmount,
    }));
  }, [transactions]);

  if (isLoading) {
    return <CardSkeleton contentClassName="h-[250px]" />;
  }

  if (isError) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Aylara Göre Toplam Satış ve Ödeme</CardTitle>
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
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="totalAmount"
              stackId="a"
              fill="var(--chart-1)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="receivedAmount"
              stackId="a"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
