"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentTransactionSchema,
  PaymentTransactionSchema,
  saleTransactionSchema,
  SaleTransactionSchema,
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
import { createCustomerTransaction } from "@/lib/api";
import { CustomerTransactionType } from "@/types";

export function CreateSaleTransactionSheet({ customerId }: { customerId: number }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<SaleTransactionSchema>({
    resolver: zodResolver(saleTransactionSchema),
    defaultValues: {
      customerId,
      transactionType: CustomerTransactionType.SALE,
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
    mutationFn: createCustomerTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-transactions", data.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-data"],
      });
    },
  });

  const onSubmit = (data: SaleTransactionSchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Satış işlemi başarıyla oluşturuldu");
        form.reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Satış işlemi oluşturulamadı");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <ShoppingCart />
          Yeni Satış
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Yeni Satış Oluştur</SheetTitle>
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

export function CreatePaymentTransactionSheet({ customerId }: { customerId: number }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<PaymentTransactionSchema>({
    resolver: zodResolver(paymentTransactionSchema),
    defaultValues: {
      customerId,
      transactionType: CustomerTransactionType.PAYMENT,
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      receivedAmount: 0,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCustomerTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-transactions", data.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });

  const onSubmit = (data: PaymentTransactionSchema) => {
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
