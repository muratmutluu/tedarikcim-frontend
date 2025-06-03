/* CUSTOMERS */
export type Customer = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxOffice?: string;
  taxNumber?: string;
  balance?: number;
};

export enum CustomerTransactionType {
  SALE = "SALE",
  PAYMENT = "PAYMENT",
}

export type CustomerTransaction = {
  id: number;
  createdAt: string;
  updatedAt: string;
  customerId: number;
  transactionType: CustomerTransactionType;
  transactionDate: string;
  description: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
  totalAmount: number;
  receivedAmount: number;
  afterBalance: number;
};

/* SUPPLIERS */
export type Supplier = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxOffice?: string;
  taxNumber?: string;
  balance?: number;
};

export enum SupplierTransactionType {
  PURCHASE = "PURCHASE",
  PAYMENT = "PAYMENT",
}

export type SupplierTransaction = {
  id: number;
  createdAt: string;
  updatedAt: string;
  supplierId: number;
  transactionType: SupplierTransactionType;
  transactionDate: string;
  description: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
  totalAmount: number;
  paidAmount: number;
  afterBalance: number;
};

/* INVOICES */
export type Invoice = {
  id: number;
  createdAt: string;
  updatedAt: string;
  invoiceDate: string;
  invoiceNumber: string;
  description: string;
  subTotalAmount: number;
  totalTaxAmount: number;
  totalAmount: number;
  customerId: number;
  customer: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxOffice: string;
    taxNumber: string;
  };
  invoiceItems: InvoiceItem[];
};

export type InvoiceListItem = Omit<Invoice, "customer" | "invoiceItems"> & {
  customer: Pick<Invoice["customer"], "name">;
};

export type InvoiceItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineSubTotalAmount: number;
  taxRate: number;
  taxAmount: number;
  lineTotalAmount: number;
  invoiceId: number;
};

/* DASHBOARD */
export type OrderType = "highest" | "lowest";

export type DashboardData = {
  totalCustomers: number;
  totalSuppliers: number;
  totalInvoices: number;
  totalCustomerTransactionAmount: number;
  totalCustomerReceivedAmount: number;
  totalSupplierTransactionAmount: number;
  totalSupplierPaidAmount: number;
};

export type CustomerStats = {
  totalTransactionCount: number;
  totalInvoiceCount: number;
  totalAmount: number;
  receivedAmount: number;
};

export type DailyTransactionTotal = {
  transactionDate: string;
  totalAmount: number;
  receivedAmount: number;
};

export type MonthlyTransactionTotal = {
  month: number;
  totalAmount: number;
  receivedAmount: number;
};

export type MonthlyTransactionAverage = {
  month: number;
  avgTotalAmount: number;
  avgReceivedAmount: number;
};
