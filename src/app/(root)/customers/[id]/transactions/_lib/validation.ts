import { CustomerTransactionType } from "@/types";
import { z } from "zod";

export const baseTransactionSchema = z.object({
  customerId: z.coerce
    .number({
      required_error: "Müşteri ID'si zorunludur.",
      invalid_type_error: "Geçerli bir müşteri ID'si girin.",
    })
    .positive({ message: "Müşteri ID'si pozitif olmalıdır." }),
  transactionType: z.enum([CustomerTransactionType.SALE, CustomerTransactionType.PAYMENT], {
    errorMap: () => ({ message: "İşlem türü geçersiz." }),
  }),
  transactionDate: z.string({
    required_error: "İşlem tarihi zorunludur.",
    invalid_type_error: "Geçerli bir işlem tarihi girin.",
  }),
  description: z
    .string({
      required_error: "Açıklama alanı zorunludur.",
      invalid_type_error: "Açıklama metin olmalıdır.",
    })
    .min(1, { message: "Açıklama boş olamaz." }),
});

export const saleTransactionSchema = baseTransactionSchema.extend({
  transactionType: z.literal(CustomerTransactionType.SALE, {
    errorMap: () => ({ message: "İşlem türü 'SALE' olmalıdır." }),
  }),
  quantity: z.coerce
    .number({
      invalid_type_error: "Adet sayısı sayısal bir değer olmalıdır.",
    })
    .positive({ message: "Adet sayısı pozitif olmalıdır." }),
  quantityUnit: z
    .string({
      required_error: "Birim alanı zorunludur.",
      invalid_type_error: "Birim bir metin olmalıdır.",
    })
    .min(1, { message: "Birim boş olamaz." }),
  unitPrice: z.coerce
    .number({
      invalid_type_error: "Birim fiyat sayısal bir değer olmalıdır.",
    })
    .nonnegative({ message: "Birim fiyat negatif olamaz." }),
  totalAmount: z.coerce
    .number({
      invalid_type_error: "Toplam tutar sayısal bir değer olmalıdır.",
      required_error: "Toplam tutar zorunludur.",
    })
    .nonnegative({ message: "Toplam tutar negatif olamaz." }),
});

export const paymentTransactionSchema = baseTransactionSchema.extend({
  transactionType: z.literal(CustomerTransactionType.PAYMENT, {
    errorMap: () => ({ message: "İşlem türü 'PAYMENT' olmalıdır." }),
  }),
  receivedAmount: z.coerce.number({
    invalid_type_error: "Alınan tutar sayısal bir değer olmalıdır.",
    required_error: "Alınan tutar girilmelidir.",
  }),
});

export type SaleTransactionSchema = z.infer<typeof saleTransactionSchema>;
export type PaymentTransactionSchema = z.infer<typeof paymentTransactionSchema>;
