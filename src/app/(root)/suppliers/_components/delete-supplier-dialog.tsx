import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteSupplier } from "@/lib/api";
import { Supplier } from "@/types";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteSupplierDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  supplier: Row<Supplier>["original"] | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteSupplierDialog({
  supplier,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteSupplierDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteSupplier,
  });

  function onDelete() {
    if (!supplier) return;
    mutation.mutate(supplier.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });

        props.onOpenChange?.(false);
        toast.success("Tedarikçi silindi.");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Tedarikçi silinemedi.");
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
          <DialogTitle>Tedarikçiyi Sil</DialogTitle>
          <DialogDescription>
            <strong>{supplier?.name}</strong> adlı firmayı silmek üzeresiniz. Bu işlem geri
            alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Vazgeç</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected supplier"
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
