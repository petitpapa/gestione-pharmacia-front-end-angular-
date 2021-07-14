import { Injectable } from "@angular/core";

import { HttpServiceRequest } from "./service.request";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class IncomeExpenseService extends HttpServiceRequest {
  baseUrl = "rs/incomes-expenses";

  constructor(private http: HttpClient) {
    super();
  }

  createIncomeExpense(incomeExpense): Observable<any> {
    return this.http.post<any>(this.baseUrl, { ...incomeExpense }).pipe(catchError(this.handleError()));
  }

  allWordings():Observable<any> {
    return this.http.get<any>(this.baseUrl + '/wording-list').pipe(catchError(this.handleError()));
  }

  dailyCashRegister(onDate): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/daily-cash-register', onDate).pipe(catchError(this.handleError()));
  }

 
  
}
