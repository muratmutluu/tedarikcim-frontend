import { getTopCustomersByBalance } from "@/lib/api";
import { Customer, OrderType } from "@/types";
import { useQuery } from "@tanstack/react-query";

type TopCustomer = Pick<Customer, "id" | "name" | "balance">;

export const useTopCustomersByBalance = (limit = 10, type: OrderType = "highest") => {
  return useQuery<TopCustomer[]>({
    queryKey: ["top-customers-by-balance", limit, type],
    queryFn: () => getTopCustomersByBalance(limit, type),
  });
};
