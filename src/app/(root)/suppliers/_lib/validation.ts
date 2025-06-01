import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z
    .string({
      required_error: "Tedarikçi adı zorunludur",
    })
    .trim()
    .nonempty("Tedarikçi adı boş bırakılamaz")
    .min(2, "Tedarikçi adı en az 2 karakter olmalıdır")
    .max(50, "Tedarikçi adı en fazla 50 karakter olmalıdır"),

  address: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email("Geçerli bir e-posta girin ya da boş bırakın")
    .optional()
    .or(z.literal("")),
  taxOffice: z.string().optional(),
  taxNumber: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema;

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;
