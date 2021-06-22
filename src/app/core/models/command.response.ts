export class CommandItem {
  id: string;
  productId: string;
  productName: string;
  image: string[];
  commandQuantity: number;
  commandDelivered: number;

  tva: number;
  supplierPrice: number;
  priceMultiplicator: number;
  unitPriceTTC: number;
  unitPriceHT: number;
  unitSalePrice: number;
  discount: number;
  expiryDate: Date;
  margin: number;
}

export class CommandContainer {
  supplierId: string;
  supplierName: string;
  commandStatus: string;
  commandId: number;
  items: CommandItem[];
  createdOn: Date;

  invoiceNumber: number;
  totalAmount: number;
  deliveryDate: Date;
  fees: number;
}

export class CommandResponse {
  errorCode?: number;
  errorMessage?: string;
  containers: CommandContainer[];
}
