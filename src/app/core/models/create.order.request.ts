export interface CreateOrderRequest {
  customerId: number;
  totalOrder: number;
  totalPaid: number;
  orderLineItem: OrderLineItem[];
  invoiceHistory?: InvoiceHistoryRequest
}

export interface OrderLineItem {
  productId: number;
  quantity: number;
  remise: number;
  price: number;
}

export interface InvoiceHistoryRequest {
  amountPaid: number;
  notes: string;
}
