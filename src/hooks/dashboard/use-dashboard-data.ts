import { getDashboardData } from "@/lib/api";
import { DashboardData } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  });
};
