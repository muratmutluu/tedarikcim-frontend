import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerSelectProps extends React.ComponentPropsWithoutRef<typeof Card> {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onCustomerChange: (customer: Customer | null) => void;
}

export function CustomerSelect({
  customers,
  selectedCustomer,
  onCustomerChange,
  children,
}: CustomerSelectProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Müşteri Seçimi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          onValueChange={(value) => {
            const customer = customers.find((c) => c.id.toString() === value);
            onCustomerChange(customer || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Müşteri Seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Müşteriler</SelectLabel>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {children}
        <Separator className="my-4" />
        {selectedCustomer ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Adı</Label>
              <p className="text-sm">{selectedCustomer.name}</p>
            </div>
            <div>
              <Label>Telefon</Label>
              <p className="text-sm">{selectedCustomer.phone}</p>
            </div>
            <div>
              <Label>Adres</Label>
              <p className="text-sm">{selectedCustomer.address}</p>
            </div>
            <div>
              <Label>E-posta</Label>
              <p className="text-sm truncate">{selectedCustomer.email}</p>
            </div>
            <div>
              <Label>Vergi Dairesi</Label>
              <p className="text-sm">{selectedCustomer.taxOffice}</p>
            </div>
            <div>
              <Label>Vergi Numarası</Label>
              <p className="text-sm">{selectedCustomer.taxNumber}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Lütfen bir müşteri seçin. Müşteri bilgileri burada görüntülenecektir.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
