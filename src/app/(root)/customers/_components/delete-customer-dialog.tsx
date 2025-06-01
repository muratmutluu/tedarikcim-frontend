"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCustomer } from "@/lib/api";
import type { Customer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";

interface DeleteCustomerDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  customer: Row<Customer>["original"] | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteCustomerDialog({
  customer,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCustomerDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCustomer,
  });

  function onDelete() {
    if (!customer) return;
    mutation.mutate(customer.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        props.onOpenChange?.(false);
        toast.success("Müşteri silindi.");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Müşteri silinemedi.");
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
          <DialogTitle>Müşteriyi Sil</DialogTitle>
          <DialogDescription>
            <strong>{customer?.name}</strong> adlı firmayı silmek üzeresiniz. Bu işlem geri
            alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Vazgeç</Button>
          </DialogClose>
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
