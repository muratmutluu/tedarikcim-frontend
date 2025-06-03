"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerSelect } from "./customer-select";
import { Customer } from "@/types";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceSchema, CreateInvoiceSchema } from "../_lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCurrency, toFixedNumber } from "@/lib/utils";

interface CreateInvoiceFormProps {
  customers: Customer[];
}

export function CreateInvoiceForm({ customers }: CreateInvoiceFormProps) {
  const form = useForm<CreateInvoiceSchema>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerId: 0,
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      description: "",
      subTotalAmount: 0,
      totalTaxAmount: 0,
      totalAmount: 0,
      invoiceItems: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          lineSubTotalAmount: 0,
          taxRate: 20, // Default %20 KDV
          taxAmount: 0,
          lineTotalAmount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "invoiceItems",
    control: form.control,
  });

  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [globalTaxRate, setGlobalTaxRate] = React.useState<number>(20);
  const router = useRouter();

  const handleCustomerChange = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    form.setValue("customerId", customer?.id || 0);
    if (customer) {
      form.setValue("description", `${customer.name} için kesilen fatura`);
      form.clearErrors("customerId");
    }
  };

  const addInvoiceItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0,
      lineSubTotalAmount: 0,
      taxRate: globalTaxRate,
      taxAmount: 0,
      lineTotalAmount: 0,
    });
  };

  // Ürün satırı silme fonksiyonu
  const removeInvoiceItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateItemTotal = (index: number) => {
    const quantity = form.watch(`invoiceItems.${index}.quantity`);
    const unitPrice = form.watch(`invoiceItems.${index}.unitPrice`);
    const taxRate = form.watch(`invoiceItems.${index}.taxRate`);

    const lineSubTotal = quantity * unitPrice;
    const lineTaxAmount = lineSubTotal * (taxRate / 100);
    const lineTotal = lineSubTotal + lineTaxAmount;

    form.setValue(`invoiceItems.${index}.lineSubTotalAmount`, toFixedNumber(lineSubTotal, 2));
    form.setValue(`invoiceItems.${index}.taxAmount`, toFixedNumber(lineTaxAmount, 2));
    form.setValue(`invoiceItems.${index}.lineTotalAmount`, toFixedNumber(lineTotal, 2));

    // Genel toplamları hesapla
    calculateTotals();
  };

  // Genel toplamları hesaplama
  const calculateTotals = React.useCallback(() => {
    const items = form.getValues("invoiceItems");
    const subTotal = items.reduce((sum, item) => sum + item.lineSubTotalAmount, 0);
    const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = items.reduce((sum, item) => sum + item.lineTotalAmount, 0);

    form.setValue("subTotalAmount", toFixedNumber(subTotal, 2));
    form.setValue("totalTaxAmount", toFixedNumber(totalTax, 2));
    form.setValue("totalAmount", toFixedNumber(total, 2));
  }, [form]);

  React.useEffect(() => {
    if (fields.length > 0) {
      calculateTotals();
    }
  }, [fields.length, calculateTotals]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", data.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
  });

  const onSubmit = (data: CreateInvoiceSchema) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast.success("Fatura başarıyla oluşturuldu!");
        form.reset();
        router.push("/invoices" + (data.id ? `/${data.id}` : ""));
      },
      onError: () => {
        toast.error("Fatura oluşturulamadı. Lütfen tekrar deneyin.");
        console.log(mutation.error);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Fatura Oluştur</CardTitle>
        <CardDescription>
          Lütfen aşağıdaki formu doldurarak yeni bir fatura oluşturun.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-[1fr_2fr] gap-4">
            <FormField
              control={form.control}
              name="customerId"
              render={() => (
                <FormItem>
                  <CustomerSelect
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    onCustomerChange={handleCustomerChange}
                  >
                    <FormMessage />
                  </CustomerSelect>
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>Fatura Detayları</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fatura Numarası</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="FAT-001" />
                      </FormControl>
                      <FormMessage className="col-span-full" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fatura Tarihi</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage className="col-span-full" />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Genel KDV Oranı %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={globalTaxRate}
                      onChange={(e) => setGlobalTaxRate(Number(e.target.value))}
                      placeholder="20"
                    />
                  </FormControl>
                </FormItem>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Fatura Açıklaması</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Murat Süngere Kesilen Fatura"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage className="col-span-full" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ürün Detayları</CardTitle>
                <Button
                  type="button"
                  onClick={addInvoiceItem}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ürün Satırı Ekle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg"
                    >
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ürün Açıklaması</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ürün açıklaması" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Miktar</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value) || "");
                                    calculateItemTotal(index);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birim Fiyat</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value) || "");
                                    calculateItemTotal(index);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.taxRate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>KDV %</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  max="100"
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value) || "");
                                    calculateItemTotal(index);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.lineSubTotalAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ara Toplam</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.taxAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>KDV Tutarı</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`invoiceItems.${index}.lineTotalAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Toplam</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeInvoiceItem(index)}
                          disabled={fields.length === 1}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Toplam Tutarlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <FormItem>
                    <FormLabel>Ara Toplam</FormLabel>
                    <div className="font-bold text-right border px-3 py-2 rounded-md bg-muted">
                      {formatCurrency(form.watch("subTotalAmount"), { min: 2, max: 2 })}
                    </div>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Toplam KDV Tutarı</FormLabel>
                    <div className="font-bold text-right border px-3 py-2 rounded-md bg-muted">
                      {formatCurrency(form.watch("totalTaxAmount"), { min: 2, max: 2 })}
                    </div>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Genel Toplam</FormLabel>
                    <FormControl>
                      <div className="font-bold text-right border px-3 py-2 rounded-md bg-muted">
                        {formatCurrency(form.watch("totalAmount"), { min: 2, max: 2 })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </CardContent>
            </Card>

            <div className="col-span-full flex justify-end">
              <Button type="submit" size="lg">
                Faturayı Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
