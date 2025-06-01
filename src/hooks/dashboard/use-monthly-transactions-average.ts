import { getMonthlyTransactionsAverage } from "@/lib/api";
import { MonthlyTransactionAverage } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useMonthlyTransactionsAverage = (year: number) => {
  return useQuery<MonthlyTransactionAverage[]>({
    queryKey: ["monthly-transactions-average", year],
    queryFn: () => getMonthlyTransactionsAverage(year),
    staleTime: 1000 * 60 * 5,
  });
};
