import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, CreateCustomerSchema } from "../_lib/validation";
import { createCustomer } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateCustomerSheet() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateCustomerSchema>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxOffice: "",
      taxNumber: "",
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCustomer,
  });

  const onSubmit = (data: CreateCustomerSchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        toast.success("Müşteri başarıyla oluşturuldu");
        form.reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Müşteri oluşturulurken bir hata oluştu");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus />
          Yeni Müşteri
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Yeni Müşteri Oluştur</SheetTitle>
          <SheetDescription>Yeni müşteri bilgilerini doldurun ve kaydedin.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
            {/* Şirket adı */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firma Adı</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Murat Sünger" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* Adres */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Buca İzmir" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* Telefon */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0 555 555 55 55" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* E-posta */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="muratmutlu010@gmail.com" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* Vergi Dairesi */}
            <FormField
              control={form.control}
              name="taxOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vergi Dairesi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Buca" />
                  </FormControl>
                  <FormMessage className="col-span-full" />
                </FormItem>
              )}
            />

            {/* Vergi Numarası */}
            <FormField
              control={form.control}
              name="taxNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vergi Numarası</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1234567890" />
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
