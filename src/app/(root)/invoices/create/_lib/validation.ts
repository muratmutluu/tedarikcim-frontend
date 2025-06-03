import { z } from "zod";

export const createInvoiceItemSchema = z.object({
  description: z.string().min(1, "Ürün açıklaması zorunludur."),
  quantity: z.coerce.number().min(1, "Miktar en az 1 olmalıdır."),
  unitPrice: z.coerce.number().min(0, "Birim fiyatı 0 veya daha büyük olmalıdır."),
  lineSubTotalAmount: z.coerce.number().min(0, "Ara toplam tutar 0 veya daha büyük olmalıdır."),
  taxRate: z.coerce.number().min(0, "Vergi oranı 0 veya daha büyük olmalıdır."),
  taxAmount: z.coerce.number().min(0, "Vergi tutarı 0 veya daha büyük olmalıdır."),
  lineTotalAmount: z.coerce.number().min(0, "Toplam tutar 0 veya daha büyük olmalıdır."),
});

export const createInvoiceSchema = z.object({
  customerId: z.coerce.number().int().min(1, "Müşteri seçilmelidir."),
  invoiceNumber: z.string().min(1, "Fatura numarası zorunludur."),
  invoiceDate: z.string(),
  description: z.string(),
  subTotalAmount: z.coerce.number().min(0, "Ara toplam tutar 0 veya daha büyük olmalıdır."),
  totalTaxAmount: z.coerce.number().min(0, "Vergi tutarı 0 veya daha büyük olmalıdır."),
  totalAmount: z.coerce.number().min(0, "Toplam tutar 0 veya daha büyük olmalıdır."),
  invoiceItems: z.array(createInvoiceItemSchema),
});

export type CreateInvoiceItemSchema = z.infer<typeof createInvoiceItemSchema>;
export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;
