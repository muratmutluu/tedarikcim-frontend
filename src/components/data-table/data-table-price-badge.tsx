import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DataTablePriceBadgeProps {
  value: number;
  className?: string;
  icon?: LucideIcon;
}

export function DataTablePriceBadge({ value, className, icon: Icon }: DataTablePriceBadgeProps) {
  const badgeClass = cn(
    "border-dashed",
    value < 0 && "bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 border-emerald-600/50",
    value > 0 && "bg-red-600/10 dark:bg-red-600/20 text-red-600 border-red-600/50",
    value === 0 && "bg-gray-600/10 dark:bg-gray-600/20 text-gray-600 border-gray-600/50",
    className
  );

  return (
    <Badge className={badgeClass}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {formatCurrency(value, { showCurrencySymbol: true })}
    </Badge>
  );
}
