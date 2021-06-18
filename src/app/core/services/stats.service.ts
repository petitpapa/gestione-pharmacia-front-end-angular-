import { Injectable } from '@angular/core';
import {HttpServiceRequest} from "./service.request";
import {CoreState} from "../store/core.reducer";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatsService extends  HttpServiceRequest<CoreState>{
  baseUrl= '/rs/stats';

  constructor(private http: HttpClient, store: Store<CoreState>) {
    super(store);
  }
  loadPurchaseProductByMonth(): Observable<any>{
    return this.http.get(this.baseUrl + '/purchase-products-by-month').pipe(catchError(this.handleError<any>()));
  }

}
