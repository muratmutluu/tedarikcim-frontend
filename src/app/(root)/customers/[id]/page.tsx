"use client";

import * as React from "react";

import { CustomerCard } from "./_components/customer-card";
import { useCustomerById } from "@/hooks/customers/use-customer";
import { CustomerAreaChart } from "./_components/customer-area-chart";
import { CustomerBarChart } from "./_components/customer-bar-chart";
import { CustomerSectionCards } from "./_components/customer-section-cards";
import { CustomerBarChartStacked } from "./_components/customer-bar-chart-stacked";
import { CustomerPieChart } from "./_components/customer-pie-chart";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const customerId = Number(resolvedParams.id);

  const { data: customer, isLoading, isError } = useCustomerById(customerId);

  return (
    <div className="space-y-2">
      <div>
        {isLoading && <div>Yükleniyor...</div>}
        {isError && <div>Hata oluştu, müşteri bilgileri yüklenemedi.</div>}
        {customer && <CustomerCard customer={customer} />}
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
    </div>
  );
}
