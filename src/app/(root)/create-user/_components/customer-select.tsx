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
import { Customer } from "@/types";

interface CustomerSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  customers: Customer[];
  onCustomerChange: (customer: Customer | null) => void;
}

export function CustomerSelect({ customers, onCustomerChange, ...props }: CustomerSelectProps) {
  return (
    <Select
      onValueChange={(value) => {
        const customer = customers.find((c) => c.id.toString() === value);
        onCustomerChange(customer || null);
      }}
      {...props}
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
  );
}
