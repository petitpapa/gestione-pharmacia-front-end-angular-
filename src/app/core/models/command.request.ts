export interface CommandRequest {

  commandId: number,
  deliveryDate: Date,
  invoiceNumber: number,
  totalDiscount: number

  invoiceDocuments?: any,
  supplierId: string,

  invoiceItems:FormData
}

export interface CommandItemRequest {
  productId: string,
  commandDelivered: number,
  expiryDate: Date,
  tva: number,
  supplierPrice: number,
  priceMultiplicator?: number,
  unitPriceTTC: number,
  unitPriceHT: number,
  unitSalePrice: number,
}
export interface InvoiceFile{
  content: string,
  name: string,
  type: string
}