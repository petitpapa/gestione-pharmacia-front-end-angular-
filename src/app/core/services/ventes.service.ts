import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  BaseModel,
  CustomerRequest,
  DateRangeResponse,
  ProductDetailResponse,
  ProductResponse,
  SaleQueryPeriodResponse,
} from "../models";
import { CreateOrderRequest } from "../models/create.order.request";
import { HttpServiceRequest } from "./service.request";

@Injectable({
  providedIn: "root",
})
export class VentesService extends HttpServiceRequest {
  baseUrl = "/rs/orders";
  productUrl = "/rs/products";
  constructor(private http: HttpClient) {
    super();
  }

  loadProductsForSale(): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(this.baseUrl)
      .pipe(catchError(this.handleError()));
  }

  createOrder(orders: CreateOrderRequest): Observable<BaseModel> {
    return this.http
      .post<BaseModel>(this.baseUrl, orders)
      .pipe(catchError(this.handleError()));
  }

  suspendOrder(orders: CreateOrderRequest): Observable<BaseModel> {
    return this.http
      .post<BaseModel>(this.baseUrl + "/suspend-sale", orders)
      .pipe(catchError(this.handleError()));
  }

  loadSuspendedSales(request: CustomerRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/get-suspended-sale",request).pipe(catchError(this.handleError()));
  }

  loadSaleePeriodQueries(): Observable<SaleQueryPeriodResponse> {
    return this.http
      .get<SaleQueryPeriodResponse>(this.baseUrl + "/queries-periods")
      .pipe(catchError(this.handleError()));
  }

  loadDateRangeQueries(range): Observable<DateRangeResponse> {
    return this.http
      .post<DateRangeResponse>(this.baseUrl + "/range-date", range)
      .pipe(catchError(this.handleError()));
  }

  loadSaleByRange(range): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/sales-date-range", range)
      .pipe(catchError(this.handleError()));
  }

  loadSalesByProducts(dateRange): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/sales-by-product-range", dateRange)
      .pipe(catchError(this.handleError()));
  }

  loadSalesByCategories(dateRange): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/sales-by-category", dateRange)
      .pipe(catchError(this.handleError()));
  }

  loadSalesByForms(dateRange): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/sales-by-form", dateRange)
      .pipe(catchError(this.handleError()));
  }

  loadProductDetail(productId: number): Promise<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(this.productUrl.concat("/").concat(productId.toString()).concat("/detail")).pipe(catchError(this.handleError())).toPromise();
  }
}
