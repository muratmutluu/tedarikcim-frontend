"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import { CardSkeleton } from "@/components/card-skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomerDailyTransactionsTotal } from "@/hooks/customers/use-customer-stats";

const chartConfig = {
  sale: {
    label: "Satış",
    color: "var(--chart-1)",
  },
  payment: {
    label: "Ödeme",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CustomerLineChart({ customerId }: { customerId: number }) {
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
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useCustomerDailyTransactionsTotal(customerId, days);

  console.log("transactions", transactions);

  const chartData = transactions.map((transaction) => ({
    date: transaction.transactionDate,
    sale: transaction.totalAmount,
    payment: transaction.receivedAmount,
  }));

  if (isLoading) {
    return <CardSkeleton contentClassName="h-[250px]" />;
  }

  if (isError) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Günlere Göre Toplam Satış ve Ödeme</CardTitle>
        <CardDescription>
          {" "}
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
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
            <Line
              dataKey="payment"
              type="monotone"
              stroke="var(--color-payment)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="sale"
              type="monotone"
              stroke="var(--color-sale)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
