"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import { formatCurrency } from "@/lib/utils";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Factory,
  FileText,
  LucideIcon,
  Users,
} from "lucide-react";

// Loading skeleton component
function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription className="flex items-center justify-between gap-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        </CardDescription>
        <CardTitle className="text-2xl font-semibold">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

// Error card component
function ErrorCard({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription className="flex items-center justify-between gap-2 text-red-500">
          {title}
          <Icon className="text-red-400" />
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums text-red-500">Hata</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function SectionCards() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <ErrorCard title="Müşteri Sayısı" icon={Users} />
        <ErrorCard title="Tedarikçi Sayısı" icon={Factory} />
        <ErrorCard title="Kesilen Faturalar" icon={FileText} />
        <ErrorCard title="Müşteri Bakiyesi" icon={BanknoteArrowUp} />
        <ErrorCard title="Tedarikçi Bakiyesi" icon={BanknoteArrowDown} />
      </div>
    );
  }

  // Müşteri bakiyesi hesaplama (alacak - borç)
  const customerBalance =
    (data?.totalCustomerTransactionAmount || 0) - (data?.totalCustomerReceivedAmount || 0);

  // Tedarikçi bakiyesi hesaplama (borç - ödenen)
  const supplierBalance =
    (data?.totalSupplierTransactionAmount || 0) - (data?.totalSupplierPaidAmount || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader className="relative">
          <CardDescription className="flex items-center justify-between gap-2">
            Müşteri Sayısı
            <Users />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <NumberTicker value={data?.totalCustomers ?? 0} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="relative">
          <CardDescription className="flex items-center justify-between gap-2">
            Tedarikçi Sayısı
            <Factory />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <NumberTicker value={data?.totalSuppliers ?? 0} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="relative">
          <CardDescription className="flex items-center justify-between gap-2">
            Kesilen Faturalar
            <FileText />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <NumberTicker value={data?.totalInvoices ?? 0} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="relative">
          <CardDescription className="flex items-center justify-between gap-2">
            Müşteri Bakiyesi
            <BanknoteArrowUp />
          </CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums ${
              customerBalance <= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(customerBalance, { showCurrencySymbol: true })}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="relative">
          <CardDescription className="flex items-center justify-between gap-2">
            Tedarikçi Bakiyesi
            <BanknoteArrowDown />
          </CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums ${
              supplierBalance >= 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(supplierBalance, { showCurrencySymbol: true })}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
