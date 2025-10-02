import axiosInstance from "./axios";
import { CreateCustomerSchema, UpdateCustomerSchema } from "@/app/(root)/customers/_lib/validation";
import {
  PaymentTransactionSchema,
  SaleTransactionSchema,
} from "@/app/(root)/customers/[id]/transactions/_lib/validation";
import type { Customer, Invoice, InvoiceListItem, OrderType, Supplier } from "@/types";
import { CreateInvoiceSchema } from "@/app/(root)/invoices/create/_lib/validation";
import { CreateSupplierSchema, UpdateSupplierSchema } from "@/app/(root)/suppliers/_lib/validation";
import {
  PaymentSupplierTransactionSchema,
  PurchaseSupplierTransactionSchema,
} from "@/app/(root)/suppliers/[id]/transactions/_lib/validation";
import { CreateCustomerUserSchema } from "@/app/(root)/create-user/_lib/validation";

/* AUTH */
export const login = async (data: { username: string; password: string }) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const createCustomerUser = async (data: CreateCustomerUserSchema) => {
  const response = await axiosInstance.post("/users", data);
  return response.data;
};

/* CUSTOMERS */
export const getCustomerById = async (customerId: number): Promise<Customer> => {
  const response = await axiosInstance.get(`/customers/${customerId}`);
  return response.data;
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get("/customers");
  return response.data;
};

export const getAllCustomersWithBalance = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get("/customers", {
    params: {
      withBalance: true,
    },
  });
  return response.data;
};

export const createCustomer = async (
  data: CreateCustomerSchema
): Promise<Omit<Customer, "balance">> => {
  const response = await axiosInstance.post("/customers", data);
  return response.data;
};

export const updateCustomer = async (args: {
  customerId: number;
  data: UpdateCustomerSchema;
}): Promise<Omit<Customer, "balance">> => {
  const response = await axiosInstance.put(`/customers/${args.customerId}`, args.data);
  return response.data;
};

export const deleteCustomer = async (customerId: number): Promise<Omit<Customer, "balance">> => {
  const response = await axiosInstance.delete(`/customers/${customerId}`);
  return response.data;
};

/* CUSTOMER TRANSACTIONS */
export const getCustomerAllTransactions = async (customerId: number) => {
  const response = await axiosInstance.get("/customer-transactions", {
    params: {
      customer: customerId,
    },
  });
  return response.data;
};

export const createCustomerTransaction = async (
  data: SaleTransactionSchema | PaymentTransactionSchema
) => {
  const response = await axiosInstance.post("/customer-transactions", data);
  return response.data;
};

export const updateCustomerTransaction = async (args: {
  transactionId: number;
  data: SaleTransactionSchema | PaymentTransactionSchema;
}) => {
  const response = await axiosInstance.put(
    `/customer-transactions/${args.transactionId}`,
    args.data
  );
  return response.data;
};

export const deleteCustomerTransaction = async (transactionId: number) => {
  const response = await axiosInstance.delete(`/customer-transactions/${transactionId}`);
  return response.data;
};

/* CUSTOMER STATS */
export const getCustomerStats = async (customerId: number) => {
  const response = await axiosInstance.get(`/customers/${customerId}/stats`);
  return response.data;
};

export const getCustomerDailyTransactionsTotal = async (customerId: number, days = 7) => {
  const response = await axiosInstance.get(
    `/customers/${customerId}/stats/daily-transactions-total`,
    {
      params: {
        days,
      },
    }
  );
  return response.data;
};

export const getCustomerMonthlyTransactionsTotal = async (customerId: number, year: number) => {
  const response = await axiosInstance.get(
    `/customers/${customerId}/stats/monthly-transactions-total`,
    {
      params: {
        year,
      },
    }
  );
  return response.data;
};

export const getCustomerMonthlyTransactionsAverage = async (customerId: number, year: number) => {
  const response = await axiosInstance.get(
    `/customers/${customerId}/stats/monthly-transactions-average`,
    {
      params: {
        year,
      },
    }
  );
  return response.data;
};

/* SUPPLIERS */
export const getSupplierById = async (supplierId: number): Promise<Supplier> => {
  const response = await axiosInstance.get(`/suppliers/${supplierId}`);
  return response.data;
};

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const response = await axiosInstance.get("/suppliers");
  return response.data;
};

export const getAllSuppliersWithBalance = async (): Promise<Supplier[]> => {
  const response = await axiosInstance.get("/suppliers", {
    params: {
      withBalance: true,
    },
  });
  return response.data;
};

export const createSupplier = async (
  data: CreateSupplierSchema
): Promise<Omit<Supplier, "balance">> => {
  const response = await axiosInstance.post("/suppliers", data);
  return response.data;
};

export const updateSupplier = async (args: {
  supplierId: number;
  data: UpdateSupplierSchema;
}): Promise<Omit<Supplier, "balance">> => {
  const response = await axiosInstance.put(`/suppliers/${args.supplierId}`, args.data);
  return response.data;
};

export const deleteSupplier = async (supplierId: number): Promise<Omit<Supplier, "balance">> => {
  const response = await axiosInstance.delete(`/suppliers/${supplierId}`);
  return response.data;
};

/* SUPPLIER TRANSACTIONS */
export const getSupplierAllTransactions = async (supplierId: number) => {
  const response = await axiosInstance.get("/supplier-transactions", {
    params: {
      supplier: supplierId,
    },
  });
  return response.data;
};

export const createSupplierTransaction = async (
  data: PurchaseSupplierTransactionSchema | PaymentSupplierTransactionSchema
) => {
  const response = await axiosInstance.post("/supplier-transactions", data);
  return response.data;
};

export const updateSupplierTransaction = async (args: {
  transactionId: number;
  data: PurchaseSupplierTransactionSchema | PaymentSupplierTransactionSchema;
}) => {
  const response = await axiosInstance.put(
    `/supplier-transactions/${args.transactionId}`,
    args.data
  );
  return response.data;
};

export const deleteSupplierTransaction = async (transactionId: number) => {
  const response = await axiosInstance.delete(`/supplier-transactions/${transactionId}`);
  return response.data;
};

/* INVOICES */
export const getInvoiceById = async (invoiceId: number): Promise<Invoice> => {
  const response = await axiosInstance.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const getAllInvoices = async (): Promise<InvoiceListItem[]> => {
  const response = await axiosInstance.get("/invoices");
  return response.data;
};

export const createInvoice = async (data: CreateInvoiceSchema) => {
  const response = await axiosInstance.post("/invoices", data);
  return response.data;
};

export const deleteInvoice = async (invoiceId: number) => {
  const response = await axiosInstance.delete(`/invoices/${invoiceId}`);
  return response.data;
};

/* DASHBOARD */
export const getDashboardData = async () => {
  const response = await axiosInstance.get("/dashboard");
  return response.data;
};

export const getTopCustomersByBalance = async (limit = 10, type: OrderType) => {
  const order = type === "highest" ? "desc" : "asc";
  const response = await axiosInstance.get("/dashboard/top-customers-by-balance", {
    params: {
      limit,
      order,
    },
  });
  return response.data;
};

export const getDailyTransactionsTotal = async (days = 7) => {
  const response = await axiosInstance.get("/dashboard/daily-transactions-total", {
    params: {
      days,
    },
  });
  return response.data;
};

export const getMonthlyTransactionsAverage = async (year: number) => {
  const response = await axiosInstance.get("/dashboard/monthly-transactions-average", {
    params: {
      year,
    },
  });
  return response.data;
};

export const getMonthlyTransactionsTotal = async (year: number) => {
  const response = await axiosInstance.get("/dashboard/monthly-transactions-total", {
    params: {
      year,
    },
  });
  return response.data;
};
