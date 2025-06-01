import { getDashboardData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type DashboardData = {
  totalCustomers: number;
  totalSuppliers: number;
  totalInvoices: number;
  totalCustomerTransactionAmount: number;
  totalCustomerReceivedAmount: number;
  totalSupplierTransactionAmount: number;
  totalSupplierPaidAmount: number;
};

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  });
};
