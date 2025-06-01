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
import { Supplier } from "@/types";
import { Row } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { updateSupplierSchema, UpdateSupplierSchema } from "../_lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSupplier } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface UpdateSupplierSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  supplier: Row<Supplier>["original"] | null;
}

export function UpdateSupplierSheet({ supplier, ...props }: UpdateSupplierSheetProps) {
  const form = useForm<UpdateSupplierSchema>({
    resolver: zodResolver(updateSupplierSchema),
  });

  React.useEffect(() => {
    if (supplier) form.reset(supplier);
  }, [supplier, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateSupplier,
  });

  const onSubmit = (data: UpdateSupplierSchema) => {
    if (!supplier) return;
    mutation.mutate(
      { supplierId: supplier.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["suppliers"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
          props.onOpenChange?.(false);
          toast.success("Tedarikçi başarıyla güncellendi");
          form.reset();
        },
        onError: () => {
          toast.error("Tedarikçi güncellenirken bir hata oluştu");
        },
      }
    );
  };

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Tedarikçi Bilgilerini Güncelle</SheetTitle>
          <SheetDescription>
            Tedarikçi bilgilerini güncelleyebilirsiniz. Lütfen bilgileri doğru girdiğinizden emin
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
