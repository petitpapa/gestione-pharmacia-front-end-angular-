import { Injectable } from '@angular/core';
import {HttpServiceRequest} from "./service.request";
import {CoreState} from "../store/core.reducer";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class StockagesService extends  HttpServiceRequest{
  baseUrl= '/rs/stockages';

  constructor(private http: HttpClient) {
    super();
  }

  autoSearchProducts(word): Observable<any>{
    return this.http.post(this.baseUrl + '/auto-complete-search-product',{"wordToSearch": word}).pipe(catchError(this.handleError()));
  }

}
