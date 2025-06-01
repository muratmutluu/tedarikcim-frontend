import { getCustomerDailyTransactionsTotal } from "@/lib/api";
import { DailyTransactionTotal } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCustomerDailyTransactions = (customerId: number, days = 7) => {
  return useQuery<DailyTransactionTotal[]>({
    queryKey: ["customer-daily-transactions", customerId, days],
    queryFn: () => getCustomerDailyTransactionsTotal(customerId, days),
  });
};
