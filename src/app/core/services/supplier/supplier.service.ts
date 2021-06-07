import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CoreState } from "../../store/core.reducer";
import {
  SupplierResponse,
  SupplierRequest,
} from "../../models/supplier.response";
import { Observable, of } from "rxjs";
import * as fromCoreActions from "../../store/core.actions";
import { MessageType } from "../../models/message.type";
import { catchError } from "rxjs/operators";
import { BaseResponse } from "../../models/base.wem";
import { BaseModel } from "../../models/base-model";
@Injectable({
  providedIn: "root",
})
export class SupplierService {
  baseUrl = "/rs/stockages";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient, private store: Store<CoreState>) { }

  loadFournisseurs(): Observable<SupplierResponse> {
    return this.http
      .get<SupplierResponse>(this.baseUrl + "/suppliers")
      .pipe(catchError(this.handleError<SupplierResponse>()));
  }

  update(fournisseur: SupplierRequest): Observable<BaseResponse> {
    return this.http
      .post<BaseResponse>(
      this.baseUrl + "/suppliers",
      fournisseur,
      this.httpOptions
    )
      .pipe(catchError(this.handleError<BaseResponse>()));
  }

  remove(id: string): Observable<BaseModel> {
    return this.http
      .post<BaseModel>(this.baseUrl + "/suppliers/" + id, {}, this.httpOptions)
      .pipe(catchError(this.handleError<BaseModel>()));
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      this.store.dispatch(
        fromCoreActions.onNotificationMessage({
          msgType: MessageType.ERROR,
          msg: error.errorMessage,
        })
      );
      return of(result);
    };
  }
}
