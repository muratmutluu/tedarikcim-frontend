// "use client";

// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import React from "react";
// import { useMonthlyTransactionsAverage } from "@/hooks/dashboard/use-monthly-transactions-average";
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//   avgTotalAmount: {
//     label: "Ortalama Satış Tutarı",
//     color: "var(--chart-1)",
//   },
//   avgReceivedAmount: {
//     label: "Ortalama Ödeme Tutarı",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig;

// export function CustomerBarChart() {
//   const [selectedYear, setSelectedYear] = React.useState<"last" | "current">("current");

//   const yearNumber =
//     selectedYear === "current" ? new Date().getFullYear() : new Date().getFullYear() - 1;

//   const { data: transactions = [], isLoading, isError } = useMonthlyTransactionsAverage(yearNumber);
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Multiple</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
//             <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
//             <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
