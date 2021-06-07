export interface RayonRequest {
  id: number;
}

export interface UpdateProductsListRequest {
  productIds: number[];
  rayonRequest?: RayonRequest;
  categoryRequest?: CategoryRequest;
}

export interface CategoryRequest{
  id: number
}
