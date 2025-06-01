"use client";

import { useQuery } from "@tanstack/react-query";
import { CreateInvoiceForm } from "./_components/create-invoice-form";
import { getAllCustomers } from "@/lib/api";

export default function NewInvoicePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers-invoice"],
    queryFn: getAllCustomers,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="container mx-auto p-4">Error loading customers</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <CreateInvoiceForm customers={data} />
    </div>
  );
}
