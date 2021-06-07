import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable , of} from "rxjs";
import { MessageType } from "../../models/message.type";
import * as fromCoreActions from '../../store/core.actions';
import {CoreState} from '../../store/core.reducer';
import { HttpClient } from '@angular/common/http';
import {UpdateProductsListRequest} from '../../../core/models/update.list.product';
import { catchError } from 'rxjs/operators';
import {ProductResponse } from '../../../core/models/product.response';
@Injectable({
  providedIn: "root",
})
export class ProductService {
  baseUrl = "/rs/products";
  constructor(private http: HttpClient, private store: Store<CoreState>) {}

  updateProducts(request: UpdateProductsListRequest): Observable<ProductResponse>{
    return this.http.post<ProductResponse>(this.baseUrl + '/update-list', request).pipe(catchError(this.handleError<ProductResponse>()))
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // log to console instead
      this.store.dispatch(
        fromCoreActions.onNotificationMessage({
          msgType: MessageType.ERROR,
          msg: error.message,
        })
      );
      return of(result as T);
    };
  }
}
