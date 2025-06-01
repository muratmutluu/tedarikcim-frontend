"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCustomerTransaction } from "@/lib/api";
import type { CustomerTransaction } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteTransactionDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  transaction: Row<CustomerTransaction>["original"] | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteTransactionDialog({
  transaction,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTransactionDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCustomerTransaction,
  });

  function onDelete() {
    if (!transaction) return;
    mutation.mutate(Number(transaction.id), {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["customer-transactions", transaction.customerId],
        });
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        props.onOpenChange?.(false);
        toast.success("İşlem silindi.");
        onSuccess?.();
      },
      onError: () => {
        toast.error("İşlem silinemedi.");
      },
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Sil
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sil</DialogTitle>
          <DialogDescription>
            <strong>{transaction?.description}</strong>
            işlemini silmek üzeresiniz. Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Vazgeç</Button>
          <Button
            aria-label="Delete selected customer"
            variant="destructive"
            onClick={onDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Evet, sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
