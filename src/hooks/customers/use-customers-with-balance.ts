import { getAllCustomersWithBalance } from "@/lib/api";
import { Customer } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCustomersWithBalance = () => {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getAllCustomersWithBalance,
  });
};
