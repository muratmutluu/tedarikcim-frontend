import { getCustomerById } from "@/lib/api";
import { Customer } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCustomerById = (id: number) => {
  return useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
  });
};
