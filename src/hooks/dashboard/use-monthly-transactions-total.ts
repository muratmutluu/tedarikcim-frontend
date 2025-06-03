import { getMonthlyTransactionsTotal } from "@/lib/api";
import { MonthlyTransactionTotal } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useMonthlyTransactionsTotal = (year: number) => {
  return useQuery<MonthlyTransactionTotal[]>({
    queryKey: ["monthly-transactions-total", year],
    queryFn: () => getMonthlyTransactionsTotal(year),
    staleTime: 1000 * 60 * 5,
  });
};
