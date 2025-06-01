"use client";

import { useQuery } from "@tanstack/react-query";
import { InvoiceDetail } from "./_components/invoice-detail";
import { useParams } from "next/navigation";
import { getInvoiceById } from "@/lib/api";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  if (isError || !data) {
    return <div className="container mx-auto p-4">Error loading invoice</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <InvoiceDetail data={data} />
    </div>
  );
}
