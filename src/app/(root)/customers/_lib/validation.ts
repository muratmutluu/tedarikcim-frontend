import * as z from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string({
      required_error: "Şirket adı zorunludur",
    })
    .trim()
    .nonempty("Şirket adı boş bırakılamaz")
    .min(2, "Şirket adı en az 2 karakter olmalıdır")
    .max(50, "Şirket adı en fazla 50 karakter olmalıdır"),

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

export const updateCustomerSchema = createCustomerSchema;

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;
  