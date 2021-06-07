export interface Item {
    productId: string;
    productName: string;
    quantityOrdered: number;
}

export interface CreateCommandRequest {
    supplierId: string;
    items: Item[];
}