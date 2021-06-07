import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { FormProducts, Forms } from "../../models/form.response";
import { Rayon } from "../../models/rayons";
import * as fromCoreActions from "../../../core/store/core.actions";
import { CoreState } from "../../../core/store/core.reducer";
import { MessageType } from "../../models/message.type";
import { CategoryResponse, ProductResponse } from "../../models";
@Injectable({
  providedIn: "root",
})
export class SettingsService {
  baseUrl = "/rs/parametrages/";
  constructor(private http: HttpClient, private store: Store<CoreState>) {}

  loadAllForms(pageIndex: number) {
    return this.http
      .get<Forms>(this.baseUrl + "all-forms?pageNumber=" + pageIndex)
      .pipe(catchError(this.handleError<Forms>()));
  }

  loadFormProducts(formId: number) {
    return this.http
      .get<FormProducts>(this.baseUrl.concat("all-forms/") + formId)
      .pipe(catchError(this.handleError<FormProducts>()));
  }

  loadProductWithRayonAndFormDescription(): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(this.baseUrl + "all-forms/rayons")
      .pipe(catchError(this.handleError<any>()));
  }

  loadCategoryWithRelatedProducts(): Observable<CategoryResponse>{
    return this.http.get<CategoryResponse>(this.baseUrl.concat( '/categories')).pipe(catchError(this.handleError<any>()));
  }

  loadRayons() {
    return this.http
      .get<Rayon>(this.baseUrl + "/rayons")
      .pipe(catchError(this.handleError<Rayon>()));
  }

  private handleError<T>(result?: T) {
    return (response: any): Observable<T> => {
      console.log(response); // log to console instead
      this.store.dispatch(
        fromCoreActions.onNotificationMessage({
          msgType: MessageType.ERROR,
          msg: response.statusText
            .toString()
            .concat(": ")
            .concat(response.error.message),
        })
      );
      return of(result);
    };
  }
}
