"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerUser, getAllCustomers } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { createCustomerUserSchema, CreateCustomerUserSchema } from "../_lib/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerSelect } from "./customer-select";
import { Customer } from "@/types";

export function CreateCustomerUserForm() {
  const form = useForm<CreateCustomerUserSchema>({
    resolver: zodResolver(createCustomerUserSchema),
    defaultValues: {
      username: "musteri_kullanici",
      password: "12345678",
      customerId: 0,
    },
  });

  const { data } = useQuery({
    queryKey: ["customers-users"],
    queryFn: getAllCustomers,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCustomerUser,
  });

  const onSubmit = (data: CreateCustomerUserSchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customer-users"] });
        toast.success("Müşteri üyelik hesabı başarıyla oluşturuldu");
        form.reset();
      },
      onError: () => {
        toast.error("Müşteri üyelik hesabı oluşturulurken bir hata oluştu");
      },
    });
  };

  const handleCustomerChange = (customer: Customer | null) => {
    if (customer) {
      form.setValue("customerId", customer.id);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="text-left">
        <CardTitle>Yeni Müşteri Üyelik Hesabı Oluştur</CardTitle>
        <CardDescription>Hesap bilgilerini girin</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Kullanıcı Adı */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="muratsunger" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* Şifre */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="*******" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* Müşteri Seçimi */}
            <FormField
              control={form.control}
              name="customerId"
              render={() => (
                <FormItem>
                  <FormLabel>Müşteri</FormLabel>
                  <FormControl>
                    <CustomerSelect
                      customers={data || []}
                      onCustomerChange={handleCustomerChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="gap-2 pt-2 sm:space-x-0">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
                )}
                Kaydet
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
