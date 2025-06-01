"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentSupplierTransactionSchema,
  PaymentSupplierTransactionSchema,
  purchaseSupplierTransactionSchema,
  PurchaseSupplierTransactionSchema,
} from "../_lib/validation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { HandCoins, ShoppingCart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplierTransaction } from "@/lib/api";
import { SupplierTransactionType } from "@/types";

export function CreatePurchaseSupplierTransactionSheet({ supplierId }: { supplierId: number }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<PurchaseSupplierTransactionSchema>({
    resolver: zodResolver(purchaseSupplierTransactionSchema),
    defaultValues: {
      supplierId,
      transactionType: SupplierTransactionType.PURCHASE,
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      quantity: 0,
      quantityUnit: "adet",
      unitPrice: 0,
      totalAmount: 0,
    },
  });

  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unitPrice");

  React.useEffect(() => {
    const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);
    const formattedTotal = parseFloat(total.toFixed(2));
    form.setValue("totalAmount", formattedTotal);
  }, [quantity, unitPrice, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createSupplierTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["supplier-transactions", data.supplierId],
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
  });

  const onSubmit = (data: PurchaseSupplierTransactionSchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Satın alım işlemi başarıyla oluşturuldu");
        form.reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Satın alım işlemi oluşturulamadı");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <ShoppingCart />
          Yeni Satın Alım
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Yeni Satın Alım Oluştur</SheetTitle>
          <SheetDescription>İşlem bilgilerini girin ve kaydedin.</SheetDescription>
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
              <Button type="submit">Kaydet</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                İptal Et
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export function CreatePaymentSupplierTransactionSheet({ supplierId }: { supplierId: number }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<PaymentSupplierTransactionSchema>({
    resolver: zodResolver(paymentSupplierTransactionSchema),
    defaultValues: {
      supplierId,
      transactionType: SupplierTransactionType.PAYMENT,
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      paidAmount: 0,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createSupplierTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["supplier-transactions", data.supplierId],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });

  const onSubmit = (data: PaymentSupplierTransactionSchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Ödeme işlemi başarıyla oluşturuldu");
        form.reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Ödeme işlemi oluşturulamadı");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <HandCoins />
          Yeni Ödeme
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Yeni Ödeme Oluştur</SheetTitle>
          <SheetDescription>İşlem bilgilerini girin ve kaydedin.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
            {/* Ortak Alanlar */}
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
                  <FormLabel>Alınan Tutar</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <Button type="submit">Kaydet</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                İptal Et
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
