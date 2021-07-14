import { Injectable } from "@angular/core";
import { HttpServiceRequest } from "./service.request";
import { CoreState } from "../store/core.reducer";
import { Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderService extends HttpServiceRequest {
  baseUrl = "/rs/orders";
  constructor(private http: HttpClient) {
    super();
  }

  loadOrderDetails(orderId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "/".concat(orderId.toString()).concat("/details")).pipe(catchError(this.handleError()));
  }

  loadOrderInvoiceHistories(orderId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl +"/".concat(orderId.toString()).concat("/invoice-histories")).pipe(catchError(this.handleError()));
  }

  updateOrderInvoiceHistories(
    order
  ): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/" + "update-invoice", {orderId: order.orderId, amount: order.amount, note:order.note}).pipe(catchError(this.handleError()));
  }
}
