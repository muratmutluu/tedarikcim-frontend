"use client";

import * as React from "react";

import { CustomerCard } from "./_components/customer-card";
import { useCustomerById } from "@/hooks/customers/use-customer";
import { CustomerAreaChart } from "./_components/customer-area-chart";
import { CustomerBarChart } from "./_components/customer-bar-chart";
import { CustomerSectionCards } from "./_components/customer-section-cards";
import { CustomerBarChartStacked } from "./_components/customer-bar-chart-stacked";
import { CustomerPieChart } from "./_components/customer-pie-chart";
import { useUser } from "@/hooks/auth/useAuth";
import { TransactionsTable } from "./_components/transactions-table";
import { useQuery } from "@tanstack/react-query";
import { getCustomerAllTransactions } from "@/lib/api";
import { Header } from "./_components/header";

export default function ClientPage() {
  const { data: user } = useUser();

  const id = user?.customerId;
  const customerId = Number(id);

  const {
    data: customer,
    isLoading: isLoadingCard,
    isError: isErrorCard,
  } = useCustomerById(customerId);
  const {
    data,
    isLoading: isLoadingTable,
    isError: isErrorTable,
  } = useQuery({
    queryKey: ["customer-transactions", customerId],
    queryFn: () => getCustomerAllTransactions(customerId),
    enabled: !!customerId,
  });

  const transactionsRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToTransactions = () => {
    transactionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!user || !user.customerId) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <Header />
      <div className="max-w-7xl mx-auto space-y-2">
        <div>
          {isLoadingCard && <div>Yükleniyor...</div>}
          {isErrorCard && <div>Hata oluştu, müşteri bilgileri yüklenemedi.</div>}
          {customer && (
            <CustomerCard customer={customer} onScrollToTransactions={scrollToTransactions} />
          )}
        </div>
        <CustomerSectionCards customerId={customerId} />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <CustomerAreaChart customerId={customerId} />
          <CustomerPieChart customerId={customerId} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CustomerBarChart customerId={customerId} />
          <CustomerBarChartStacked customerId={customerId} />
        </div>

        <div className="my-6" ref={transactionsRef}>
          {isLoadingTable && <div>Yükleniyor...</div>}
          {isErrorTable && <div>Hata oluştu, işlemler yüklenemedi.</div>}
          {data && <TransactionsTable data={data.transactions} customerId={customerId} />}
        </div>
      </div>
    </div>
  );
}
