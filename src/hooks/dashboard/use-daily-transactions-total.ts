import { getDailyTransactionsTotal } from "@/lib/api";
import { DailyTransactionTotal } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useDailyTransactionsTotal = (days = 7) => {
  return useQuery<DailyTransactionTotal[]>({
    queryKey: ["daily-transactions-total", days],
    queryFn: () => getDailyTransactionsTotal(days),
    staleTime: 1000 * 60 * 5,
  });
};
