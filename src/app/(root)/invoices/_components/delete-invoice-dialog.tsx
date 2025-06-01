import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteInvoice } from "@/lib/api";
import { InvoiceListItem } from "@/types";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface DeleteInvoiceDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  invoice: Row<InvoiceListItem>["original"] | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteInvoiceDialog({
  invoice,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteInvoiceDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteInvoice, // Assuming deleteInvoice is defined elsewhere
  });

  function onDelete() {
    if (!invoice) return;
    mutation.mutate(invoice.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });

        props.onOpenChange?.(false);
        toast.success("Fatura silindi.");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Fatura silinemedi.");
        console.error("Error deleting invoice:", mutation.error);
      },
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <button className="btn btn-outline btn-sm">
            <span className="icon-trash mr-2" aria-hidden="true" />
            Sil
          </button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-red-500">Faturayı Sil</DialogTitle>
          <DialogDescription>
            <strong></strong>
            <strong>
              {invoice?.invoiceNumber} - {invoice?.description}
            </strong>{" "}
            faturasını silmek üzeresiniz. Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
