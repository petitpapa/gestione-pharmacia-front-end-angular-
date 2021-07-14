import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CustomerResponse } from "../models/customer.response";
import { Observable } from "rxjs";
import { HttpServiceRequest } from "./service.request";
import { CoreState } from "../store/core.reducer";
import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CustomerService extends HttpServiceRequest {
  baseUrl = "/rs/customers";

  constructor(private http: HttpClient) {super()}

  loadCustomers(): Observable<CustomerResponse> {
    return this.http
      .get<CustomerResponse>(this.baseUrl)
      .pipe(catchError(this.handleError()));
  }

  findCustomer(match: string): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "/auto-complete-search-customer?name=" + match)
      .pipe(catchError(this.handleError()));
  }

  findCostomerOrders(customerId: string): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "/" + customerId + "/orders-not-fully-paid")
      .pipe(catchError(this.handleError()));
  }
}
