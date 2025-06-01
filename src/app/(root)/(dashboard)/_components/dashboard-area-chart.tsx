"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDailyTransactionsTotal } from "@/hooks/dashboard/use-daily-transactions-total";
import { CardSkeleton } from "@/components/card-skeleton";

const chartConfig = {
  amounts: {
    label: "Tutar",
  },
  sale: {
    label: "Satış",
    color: "var(--chart-1)",
  },
  payment: {
    label: "Ödeme",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DashboardAreaChart() {
  const [timeRange, setTimeRange] = React.useState("30d");

  const getDaysFromRange = (range: string) => {
    switch (range) {
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "90d":
        return 90;
      default:
        return 30;
    }
  };

  const isMobile = useIsMobile();
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const days = getDaysFromRange(timeRange);
  const { data: transactions = [], isLoading, isError } = useDailyTransactionsTotal(days);

  const chartData = transactions.map((transaction) => ({
    date: transaction.transactionDate,
    sale: transaction.totalAmount,
    payment: transaction.receivedAmount,
  }));

  if (isLoading) {
    return <CardSkeleton className="@container/card" contentClassName="h-[250px]" />;
  }

  if (isError) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }

  return (
    <Card className="@container/card justify-between">
      <CardHeader className="relative">
        <CardTitle>Günlere Göre Toplam Müşteri İşlemleri</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Son {timeRange === "7d" ? "7 gün" : timeRange === "90d" ? "3 ay" : "30 gün"} toplam
          </span>
          <span className="@[540px]/card:hidden">
            Son {timeRange === "7d" ? "7 gün" : timeRange === "90d" ? "3 ay" : "30 gün"}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Son 3 ay
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Son 30 gün
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Son 7 gün
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Son 7 gün" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Son 3 ay
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Son 30 gün
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Son 7 gün
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillSale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sale)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-sale)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPayment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-payment)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-payment)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("tr-TR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("tr-TR", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="payment"
              type="natural"
              fill="url(#fillPayment)"
              stroke="var(--color-payment)"
            />
            <Area dataKey="sale" type="natural" fill="url(#fillSale)" stroke="var(--color-sale)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
