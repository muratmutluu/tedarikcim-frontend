"use client";

import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SupplierTransaction, SupplierTransactionType } from "@/types";
import { Row } from "@tanstack/react-table";
import {
  paymentSupplierTransactionSchema,
  PaymentSupplierTransactionSchema,
  purchaseSupplierTransactionSchema,
  PurchaseSupplierTransactionSchema,
} from "../_lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplierTransaction } from "@/lib/api";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { format } from "date-fns";

interface UpdateTransactionSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  transaction: Row<SupplierTransaction>["original"] | null;
}

export function UpdatePurchaseTransactionSheet({ transaction, ...props }: UpdateTransactionSheetProps) {
  const form = useForm<PurchaseSupplierTransactionSchema>({
    resolver: zodResolver(purchaseSupplierTransactionSchema),
  });

  React.useEffect(() => {
    if (transaction && transaction.transactionType === SupplierTransactionType.PURCHASE) {
      form.reset({
        supplierId: transaction.supplierId,
        transactionType: SupplierTransactionType.PURCHASE,
        transactionDate: format(transaction.transactionDate, "yyyy-MM-dd"),
        description: transaction.description,
        quantity: transaction.quantity,
        quantityUnit: transaction.quantityUnit,
        unitPrice: transaction.unitPrice,
        totalAmount: transaction.totalAmount,
      });
    }
  }, [transaction, form]);

  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unitPrice");
  console.log("Gelen transaction verisi:", transaction);

  React.useEffect(() => {
    const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);
    form.setValue("totalAmount", total);
  }, [quantity, unitPrice, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateSupplierTransaction,
  });

  const onSubmit = (data: PurchaseSupplierTransactionSchema) => {
    if (!transaction) return;
    mutation.mutate(
      { transactionId: transaction.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["supplier-transactions", data.supplierId] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
          props.onOpenChange?.(false);
          toast.success("İşlem başarıyla güncellendi");
          form.reset();
        },
        onError: () => {
          toast.error("İşlem güncellenirken bir hata oluştu.");
        },
      }
    );
  };
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Satın Alım İşlemini Güncelle</SheetTitle>
          <SheetDescription>Satın Alım bilgilerini girin ve kaydedin.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarih</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ürün açıklaması" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miktar</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantityUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birim</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="adet, kg vs." />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birim Fiyat</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toplam Tutar</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
                )}
                Kaydet
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  İptal Et
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export function UpdatePaymentTransactionSheet({
  transaction,
  ...props
}: UpdateTransactionSheetProps) {
  const form = useForm<PaymentSupplierTransactionSchema>({
    resolver: zodResolver(paymentSupplierTransactionSchema),
  });

  React.useEffect(() => {
    if (transaction && transaction.transactionType === SupplierTransactionType.PAYMENT) {
      form.reset({
        supplierId: transaction.supplierId,
        transactionType: SupplierTransactionType.PAYMENT,
        transactionDate: format(transaction.transactionDate, "yyyy-MM-dd"),
        description: transaction.description,
        paidAmount: transaction.paidAmount,
      });
    }
  }, [transaction, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateSupplierTransaction,
  });

  const onSubmit = (data: PaymentSupplierTransactionSchema) => {
    if (!transaction) return;
    mutation.mutate(
      { transactionId: transaction.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["supplier-transactions", data.supplierId] });
          props.onOpenChange?.(false);
          toast.success("İşlem başarıyla güncellendi");
          form.reset();
        },
        onError: () => {
          toast.error("İşlem güncellenirken bir hata oluştu.");
        },
      }
    );
  };

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Ödeme İşlemini Güncelle</SheetTitle>
          <SheetDescription>Ödeme bilgilerini girin ve kaydedin.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarih</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ödeme açıklaması" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ödenen Tutar</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
                )}
                Kaydet
              </Button>{" "}
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  İptal Et
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
