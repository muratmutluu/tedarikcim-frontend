"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerStats } from "@/hooks/customers/use-customer-stats";
import { formatCurrency } from "@/lib/utils";
import { BanknoteArrowDown, BanknoteArrowUp, FileText, Users, Wallet } from "lucide-react";

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
function ErrorCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription className="text-red-500">{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums text-red-500">Hata</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function CustomerSectionCards({ customerId }: { customerId: number }) {
  const { data: stats, isLoading, error } = useCustomerStats(customerId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ErrorCard title="Toplam İşlem Sayısı" />
        <ErrorCard title="Kesilen Faturalar" />
        <ErrorCard title="Bakiye" />
      </div>
    );
  }

  const balance = stats.totalAmount - stats.receivedAmount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {/* Toplam İşlem Sayısı */}
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Toplam İşlem Sayısı
            <Users />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <NumberTicker value={stats.totalTransactionCount} />
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Kesilen Faturalar */}
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Kesilen Faturalar
            <FileText />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <NumberTicker value={stats.totalInvoiceCount} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Toplam Satış
            <BanknoteArrowUp />
          </CardDescription>
          <CardTitle>
            <Badge variant="outline" className="text-base border-dashed">
              {formatCurrency(stats.totalAmount, { showCurrencySymbol: true })}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Toplam Alınan Tutar
            <BanknoteArrowDown />
          </CardDescription>
          <CardTitle>
            <Badge variant="outline" className="text-base border-dashed">
              {formatCurrency(stats.receivedAmount, { showCurrencySymbol: true })}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Bakiye */}
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">Bakiye</div>
            <Wallet />
          </CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums ${
              balance >= 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(balance, { showCurrencySymbol: true })}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
