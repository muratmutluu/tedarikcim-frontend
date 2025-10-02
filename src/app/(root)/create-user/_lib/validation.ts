import { z } from "zod";

export const createCustomerUserSchema = z.object({
  username: z
    .string({
      required_error: "Kullanıcı adı zorunludur",
      invalid_type_error: "Kullanıcı adı metin olmalıdır",
    })
    .nonempty("Kullanıcı adı boş olamaz"),

  password: z
    .string({ required_error: "Parola zorunludur" })
    .min(8, "Parola en az 8 karakter olmalıdır")
    .max(50, "Parola en fazla 50 karakter olabilir"),
  customerId: z
    .number({
      required_error: "Müşteri ID zorunludur",
      invalid_type_error: "Müşteri ID sayısal olmalıdır",
    })
    .int("Müşteri ID tam sayı olmalıdır"),
});
export type CreateCustomerUserSchema = z.infer<typeof createCustomerUserSchema>;
