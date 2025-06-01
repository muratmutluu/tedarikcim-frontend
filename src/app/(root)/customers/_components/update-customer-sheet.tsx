import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Customer } from "@/types";
import { updateCustomerSchema, UpdateCustomerSchema } from "../_lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import * as React from "react";
import { Loader } from "lucide-react";

interface UpdateCustomerSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  customer: Row<Customer>["original"] | null;
}

export function UpdateCustomerSheet({ customer, ...props }: UpdateCustomerSheetProps) {
  const form = useForm<UpdateCustomerSchema>({
    resolver: zodResolver(updateCustomerSchema),
  });

  React.useEffect(() => {
    if (customer) form.reset(customer);
  }, [customer, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateCustomer,
  });

  const onSubmit = (data: UpdateCustomerSchema) => {
    if (!customer) return;
    mutation.mutate(
      { customerId: customer.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["customers"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
          props.onOpenChange?.(false);
          toast.success("Müşteri başarıyla güncellendi");
          form.reset();
        },
        onError: () => {
          toast.error("Müşteri güncellenirken bir hata oluştu");
        },
      }
    );
  };

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Müşteri Bilgilerini Güncelle</SheetTitle>
          <SheetDescription>
            Müşteri bilgilerini güncelleyebilirsiniz. Lütfen bilgileri doğru girdiğinizden emin
            olun.
          </SheetDescription>
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
        {/* Form Submit */}
      </SheetContent>
    </Sheet>
  );
}
