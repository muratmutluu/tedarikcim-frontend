import { SupplierTransactionType } from "@/types";
import { z } from "zod";

export const baseTransactionSchema = z.object({
  supplierId: z.coerce
    .number({
      required_error: "Tedarikçi ID'si zorunludur.",
      invalid_type_error: "Geçerli bir tedarikçi ID'si girin.",
    })
    .positive({ message: "Tedarikçi ID'si pozitif olmalıdır." }),
  transactionType: z.enum([SupplierTransactionType.PURCHASE, SupplierTransactionType.PAYMENT], {
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

export const purchaseSupplierTransactionSchema = baseTransactionSchema.extend({
  transactionType: z.literal(SupplierTransactionType.PURCHASE, {
    errorMap: () => ({ message: "İşlem türü 'PURCHASE' olmalıdır." }),
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

export const paymentSupplierTransactionSchema = baseTransactionSchema.extend({
  transactionType: z.literal(SupplierTransactionType.PAYMENT, {
    errorMap: () => ({ message: "İşlem türü 'PAYMENT' olmalıdır." }),
  }),
  paidAmount: z.coerce.number({
    invalid_type_error: "Alınan tutar sayısal bir değer olmalıdır.",
    required_error: "Alınan tutar girilmelidir.",
  }),
});

export type PurchaseSupplierTransactionSchema = z.infer<typeof purchaseSupplierTransactionSchema>;
export type PaymentSupplierTransactionSchema = z.infer<typeof paymentSupplierTransactionSchema>;
