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
import { CustomerTransaction, CustomerTransactionType } from "@/types";
import { Row } from "@tanstack/react-table";
import {
  paymentTransactionSchema,
  PaymentTransactionSchema,
  saleTransactionSchema,
  SaleTransactionSchema,
} from "../_lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerTransaction } from "@/lib/api";
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
  transaction: Row<CustomerTransaction>["original"] | null;
}

export function UpdateSaleTransactionSheet({ transaction, ...props }: UpdateTransactionSheetProps) {
  const form = useForm<SaleTransactionSchema>({
    resolver: zodResolver(saleTransactionSchema),
  });

  React.useEffect(() => {
    if (transaction && transaction.transactionType === "SALE") {
      form.reset({
        customerId: transaction.customerId,
        transactionType: CustomerTransactionType.SALE,
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
    mutationFn: updateCustomerTransaction,
  });

  const onSubmit = (data: SaleTransactionSchema) => {
    if (!transaction) return;
    mutation.mutate(
      { transactionId: transaction.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["customer-transactions", data.customerId] });
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
          <SheetTitle>Satış İşlemini Güncelle</SheetTitle>
          <SheetDescription>Satış bilgilerini girin ve kaydedin.</SheetDescription>
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
  const form = useForm<PaymentTransactionSchema>({
    resolver: zodResolver(paymentTransactionSchema),
  });

  React.useEffect(() => {
    if (transaction && transaction.transactionType === CustomerTransactionType.PAYMENT) {
      form.reset({
        customerId: transaction.customerId,
        transactionType: CustomerTransactionType.PAYMENT,
        transactionDate: format(transaction.transactionDate, "yyyy-MM-dd"),
        description: transaction.description,
        receivedAmount: transaction.receivedAmount,
      });
    }
  }, [transaction, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateCustomerTransaction,
  });

  const onSubmit = (data: PaymentTransactionSchema) => {
    if (!transaction) return;
    mutation.mutate(
      { transactionId: transaction.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["customer-transactions", data.customerId] });
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
              name="receivedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alınan Tutar</FormLabel>
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
