"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTopCustomersByBalance } from "@/hooks/customers/use-top-customers-by-balance";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { OrderType } from "@/types";
import { CardSkeleton } from "@/components/card-skeleton";

interface DashboardHorizontalBarChartProps {
  type: OrderType;
  limit?: number;
}

export function DashboardHorizontalBarChart({
  type,
  limit = 10,
}: DashboardHorizontalBarChartProps) {
  const router = useRouter();

  const { data: customers = [], isLoading, isError } = useTopCustomersByBalance(limit, type);

  const handleBarClick = (data: { payload: { id: number } }) => {
    const customerId = data.payload.id;
    router.push(`/customers/${customerId}`);
  };

  const chartData = customers.map((customer, index) => ({
    id: customer.id,
    name: customer.name,
    balance: customer.balance,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = {
    balance: { label: "Bakiye" },
  } satisfies ChartConfig;

  const chartTitle =
    type === "highest"
      ? `Bakiyesi En Yüksek ${limit} Müşteri`
      : `Alacağı En Yüksek ${limit} Müşteri`;

  if (isLoading) {
    return <CardSkeleton contentClassName="h-[250px]" title={chartTitle} />;
  }

  if (isError) {
    return <CardSkeleton contentClassName="h-[250px]" variant="error" />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>Güncel Veriler</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: type === "highest" ? 32 : 0,
              left: type === "lowest" ? 32 : 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="balance" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="balance" layout="vertical" radius={4} onClick={handleBarClick}>
              <LabelList
                dataKey="balance"
                position="right"
                offset={6}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => formatCurrency(value, { showCurrencySymbol: true })}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
