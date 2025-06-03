"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, TurkishNumberConverter } from "@/lib/utils";
import { Invoice } from "@/types";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { usePDF } from "react-to-pdf";

export function InvoiceDetail({ data }: { data: Invoice }) {
  const invoiceDate = format(new Date(data.invoiceDate), "dd.MM.yyyy");

  const { toPDF, targetRef } = usePDF({
    method: "open",
    filename: "invoice.pdf",
    page: {
      format: "A4",
    },
  });

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button onClick={() => toPDF()}>İndir</Button>
      </div>
      <div ref={targetRef}>
        <Card className="pt-0 rounded-t-none">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <CardTitle className="text-xl">e-Fatura</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-secondary text-primary rounded-xl font-bold">
                SATIŞ FATURASI
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {/* Satıcı Bilgileri - Fatura Kısa Bilgi */}
            <div className="flex justify-between items-start px-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-primary">MUTLULAR SÜNGER</h2>
                <p className="text-sm text-muted-foreground">
                  ALTINOVA MAH. KIRAN SOK.24/26 OSMANGAZİ / BURSA
                </p>
                <p className="text-sm text-muted-foreground">Vergi No: 34768027658</p>
                <p className="text-sm text-muted-foreground">Vergi Dairesi: ULUDAĞ</p>
                <p className="text-sm text-muted-foreground">Telefon: 0 555 555 55 55</p>
                <p className="text-sm text-muted-foreground">
                  E-posta: mutlularsunger@hotmail.com{" "}
                </p>
              </div>
              <div className="flex flex-col items-end bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">FATURA NO</p>
                <p className="text-2xl font-bold text-foreground">{data.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground mt-4">FATURA TARİHİ</p>
                <p className="text-sm font-semibold text-foreground">{invoiceDate}</p>
              </div>
            </div>

            <Separator />

            {/* Müşteri Bilgileri - Fatura Detayları */}
            <div className="grid grid-cols-2 gap-16">
              <Card className="gap-2">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Müşteri Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <span className="font-semibold">Ad/Unvan:</span> {data.customer.name}
                  </p>
                  <p>
                    <span className="font-semibold">Adres: </span>
                    {data.customer.address || "Adres bilgisi yok"}
                  </p>
                  <p>
                    <span className="font-semibold">Vergi No: </span>
                    {data.customer.taxNumber || "Vergi numarası yok"}
                  </p>
                  <p>
                    <span className="font-semibold">Vergi Dairesi: </span>
                    {data.customer.taxOffice || "Vergi dairesi bilgisi yok"}
                  </p>
                  <p>
                    <span className="font-semibold">Telefon: </span>
                    {data.customer.phone || "Telefon bilgisi yok"}
                  </p>
                  <p>
                    <span className="font-semibold">E-posta: </span>
                    {data.customer.email || "E-posta bilgisi yok"}
                  </p>
                </CardContent>
              </Card>
              <Card className="gap-2">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Fatura Detayları</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <span className="font-semibold">Senaryo:</span> TİCARİ FATURA
                  </p>
                  <p>
                    <span className="font-semibold">Fatura Tipi:</span> SATIŞ
                  </p>
                  <p>
                    <span className="font-semibold">Versiyon:</span> TR1.2 / UBL 2.1
                  </p>
                  <p>
                    <span className="font-semibold">Para Birimi:</span> TRY
                  </p>
                  <p>
                    <span className="font-semibold">Fatura No: </span>
                    {data.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Fatura Tarihi: </span>
                    {invoiceDate}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ürün Detayları */}
            <Card className="gap-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ürün Detayları</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="text-primary-foreground font-bold">SN</TableHead>
                      <TableHead className="text-primary-foreground font-bold">
                        Ürün Açıklama
                      </TableHead>
                      <TableHead className="text-primary-foreground font-bold text-right">
                        Miktar
                      </TableHead>
                      <TableHead className="text-primary-foreground font-bold text-right">
                        Birim Fiyat
                      </TableHead>
                      <TableHead className="text-primary-foreground font-bold text-right">
                        KDV
                      </TableHead>
                      <TableHead className="text-primary-foreground text-right font-bold">
                        Toplam Tutar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.invoiceItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="capitalize">{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)} TL
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.taxAmount)} TL | ({item.taxRate.toFixed(2)} %)
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.lineTotalAmount)} TL
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              {/* Banka Bilgileri */}
              <Card className="gap-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Banka Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-800">ZİRAAT BANKASI</span>
                    <span className="text-sm font-mono">TR57 0001 0017 8960 6338 9750 02</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-800">YAPI KREDİ BANKASI</span>
                    <span className="text-sm font-mono">TR41 0006 7010 0000 0082 7804 21</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-800">İŞ BANKASI</span>
                    <span className="text-sm font-mono">TR76 0006 4000 0012 2090 7715 12</span>
                  </div>
                </CardContent>
              </Card>

              {/* Toplam Tutar - Ödenecek Tutar */}
              <Card>
                <CardContent className="text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Mal Hizmet Toplam Tutarı</span>
                      <span className="font-semibold">
                        {formatCurrency(data.subTotalAmount)} TL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>KDV % 20</span>
                      <span className="font-semibold">
                        {formatCurrency(data.totalTaxAmount)} TL
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Vergiler Dahil Toplam Tutar</span>
                      <span className="font-semibold">{formatCurrency(data.totalAmount)} TL</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-blue-600">
                      <span>Ödenecek Tutar</span>
                      <span>{formatCurrency(data.totalAmount)} TL</span>
                    </div>
                    <div className="flex justify-between font-mono capitalize">
                      <span className="font-semibold">Yalnız:</span>
                      {TurkishNumberConverter.convertToCurrencyWithCents(data.totalAmount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Yazıyla Ödenecek Tutar
            <Card className="p-2">
              <CardContent className="text-center font-mono">
                <span className="font-semibold font-mono">Yalnız:</span> On Altı Bin Yüz Seksen Üç
                Türk Lirası
              </CardContent>
            </Card> */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
