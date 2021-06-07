import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CustomerResponse} from '../models/customer.response';
import { Observable } from 'rxjs';
import { HttpServiceRequest } from './service.request';
import { CoreState } from '../store/core.reducer';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends HttpServiceRequest<CoreState>{
  baseUrl = '/rs/customers';

  constructor(private http: HttpClient, store: Store<CoreState>) {
    super(store);
  }

  loadCustomers(): Observable<CustomerResponse>{
    return this.http.get<CustomerResponse>(this.baseUrl).pipe(catchError(this.handleError<any>()));
  }

}
