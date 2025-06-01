import { getAllSuppliersWithBalance } from "@/lib/api";
import { Supplier } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useSuppliersWithBalance = () => {
  return useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliersWithBalance,
  });
};
