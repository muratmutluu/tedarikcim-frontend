"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getCustomerAllTransactions } from "@/lib/api";
import { TransactionsTable } from "./_components/transactions-table";
import { Banknote, MapPin, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitialsForAvatar } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTablePriceBadge } from "@/components/data-table/data-table-price-badge";

export default function CustomerTransactionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const customerId = Number(resolvedParams.id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-transactions", customerId],
    queryFn: () => getCustomerAllTransactions(customerId),
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
  }
  if (isError || !data) {
    return <div>Error loading transactions</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex  items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
        <Avatar className="h-8 w-8 ring-2 ring-accent">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
            {getInitialsForAvatar(data.customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 justify-between items-center">
          <h2 className="text-xl font-medium">{data.customer.name}</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <MapPin className="w-3 h-3 mr-1" />
              {data.customer.address}
            </Badge>
            <Badge variant="secondary">
              <Phone className="w-3 h-3 mr-1" />
              {data.customer.phone}
            </Badge>
            <Badge variant="secondary">
              <User className="w-3 h-3 mr-1" />
              Müşteri #{data.customer.id}
            </Badge>
            <DataTablePriceBadge value={data.customer.balance} icon={Banknote} />
          </div>
        </div>
      </div>
      <TransactionsTable data={data.transactions} customerId={customerId} />
    </div>
  );
}
