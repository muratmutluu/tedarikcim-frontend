import { useQuery } from "@tanstack/react-query";
import {
  getCustomerStats,
  getCustomerDailyTransactionsTotal,
  getCustomerMonthlyTransactionsTotal,
  getCustomerMonthlyTransactionsAverage,
} from "@/lib/api";

import {
  CustomerStats,
  DailyTransactionTotal,
  MonthlyTransactionTotal,
  MonthlyTransactionAverage,
} from "@/types";

// 1) useCustomerStats
export const useCustomerStats = (customerId: number) => {
  return useQuery<CustomerStats>({
    queryKey: ["customer-stats", customerId],
    queryFn: () => getCustomerStats(customerId),
  });
};

export const useCustomerDailyTransactionsTotal = (customerId: number, days = 7) => {
  return useQuery<DailyTransactionTotal[]>({
    queryKey: ["customer-daily-transactions-total", customerId, days],
    queryFn: () => getCustomerDailyTransactionsTotal(customerId, days),
  });
};

export const useCustomerMonthlyTransactionsTotal = (customerId: number, year: number) => {
  return useQuery<MonthlyTransactionTotal[]>({
    queryKey: ["customer-monthly-transactions-total", customerId, year],
    queryFn: () => getCustomerMonthlyTransactionsTotal(customerId, year),
  });
};

export const useCustomerMonthlyTransactionsAverage = (customerId: number, year: number) => {
  return useQuery<MonthlyTransactionAverage[]>({
    queryKey: ["customer-monthly-transactions-average", customerId, year],
    queryFn: () => getCustomerMonthlyTransactionsAverage(customerId, year),
  });
};
