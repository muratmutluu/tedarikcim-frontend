import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateInvoiceRedirectButton() {
  return (
    <Link href="/invoices/create" passHref>
      <Button size="sm" asChild>
        <span className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Yeni Fatura
        </span>
      </Button>
    </Link>
  );
}
