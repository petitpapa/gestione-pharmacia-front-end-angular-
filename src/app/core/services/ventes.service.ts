import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
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
import { CoreState } from "../store/core.reducer";
import { HttpServiceRequest } from "./service.request";

@Injectable({
  providedIn: "root",
})
export class VentesService extends HttpServiceRequest<CoreState> {
  baseUrl = "/rs/orders";
  productUrl = "/rs/products";
  constructor(private http: HttpClient, store: Store<CoreState>) {
    super(store);
  }

  loadProductsForSale(): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(this.baseUrl)
      .pipe(catchError(this.handleError<any>()));
  }

  createOrder(orders: CreateOrderRequest): Observable<BaseModel> {
    return this.http
      .post<BaseModel>(this.baseUrl, orders)
      .pipe(catchError(this.handleError<any>()));
  }
 
  suspendOrder(orders: CreateOrderRequest): Observable<BaseModel> {
    return this.http
      .post<BaseModel>(this.baseUrl + "/suspend-sale", orders)
      .pipe(catchError(this.handleError<any>()));
  }

  loadSuspendedSales(request: CustomerRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/get-suspended-sale",request).pipe(catchError(this.handleError<any>()));
  }

  loadSaleePeriodQueries(): Observable<SaleQueryPeriodResponse> {
    return this.http
      .get<SaleQueryPeriodResponse>(this.baseUrl + "/queries-periods")
      .pipe(catchError(this.handleError<any>()));
  }

  loadDateRangeQueries(range): Observable<DateRangeResponse> {
    return this.http
      .post<DateRangeResponse>(this.baseUrl + "/range-date", range)
      .pipe(catchError(this.handleError<any>()));
  }

  loadSaleByRange(range): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/sales-date-range", range)
      .pipe(catchError(this.handleError<any>()));
  }

  loadSalesByProducts(dateRange): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/sales-by-product-range", dateRange)
      .pipe(catchError(this.handleError<any>()));
  }

  loadProductDetail(productId: number): Promise<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(this.productUrl.concat("/").concat(productId.toString()).concat("/detail")).pipe(catchError(this.handleError<any>())).toPromise();
  }
}
