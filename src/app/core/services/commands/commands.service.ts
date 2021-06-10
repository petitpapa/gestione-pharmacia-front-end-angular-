import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as fromCoreActions from '../../store/core.actions';
import {CoreState} from '../../store/core.reducer';
import {CommandAvoirResponse, MessageType} from '../../models';
import {ProductResponse} from '../../models';
import {CreateCommandRequest} from '../../models';
import {BaseResponse} from '../../models';
import {CommandResponse} from '../../models';
import {BaseModel, CoefficientResponse, ConfirmCommandRequest, SupplierResponse} from '../../models';
import {ReturnedProductResponse} from "../../models/product.return.response";
import {FactureByCategoryResponse} from "../../models/facture.by.category.response";

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  productBaseUrl = '/rs/products';
  private commandBaseUrl = '/rs/commandes';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private store: Store<CoreState>) {
  }

  productCommand(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>('/rs/products/commandes').pipe(catchError(this.handleError<ProductResponse>()));
  }

  createNewCommand(request: CreateCommandRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(this.commandBaseUrl, request, this.httpOptions);
  }

  loadNewCommandsByStatus(status: string): Observable<CommandResponse> {
    return this.http.post<CommandResponse>(this.commandBaseUrl + '/new-commands', {status: status}, this.httpOptions);
  }

  loadCommandById(id: number): Observable<CommandResponse> {
    return this.http.get<CommandResponse>((this.commandBaseUrl + '/').concat(id.toString())).pipe(catchError(this.handleError<any>()));
  }

  loadCoefficients(): Observable<CoefficientResponse> {
    return this.http.get<CoefficientResponse>('/rs/coefficients');
  }

  saveInvoice(file: any): Observable<CommandResponse> {
    return this.http.post<CommandResponse>(this.commandBaseUrl + '/update-command', file).pipe(catchError(this.handleError<any>()));
  }

  validateCommand(request: ConfirmCommandRequest): Observable<BaseModel> {
    return this.http.post<BaseModel>(this.commandBaseUrl + '/validate', request).pipe(catchError(this.handleError<any>()));
  }

  loadCommandMaded(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get<any>(this.commandBaseUrl.concat('/').concat(startDate.toISOString().split('T')[0]).concat('/to/').concat(endDate.toISOString().split('T')[0])).pipe(catchError(this.handleError<any>()));
  }

  sendReturnedProduct(products: any[]): Observable<any> {
    return this.http.post<any>(this.commandBaseUrl + '/returned-products', {products: products}).pipe(catchError(this.handleError<any>()));
  }

  loadSuppliersWithReturnedProductsNotCompleted(): Observable<SupplierResponse> {
    return this.http.get<SupplierResponse>(this.commandBaseUrl + '/suppliers-with-returned-products-not-completed').pipe(catchError(this.handleError<any>()));
  }

  loadReturnedProductOfSupplierNotCompleted(supplierId): Observable<ReturnedProductResponse> {
    return this.http.post<ReturnedProductResponse>(this.commandBaseUrl + '/list-of-returned-products-of-supplier-not-completed', {supplierId}).pipe(catchError(this.handleError<any>()));
  }

  updateReturnedProductOfSupplier(products: any[]): Observable<BaseModel> {
    return this.http.post<BaseResponse>(this.commandBaseUrl + '/list-of-returned-products-of-supplier', {products: products}).pipe(catchError(this.handleError<any>()));
  }

  loadRejectedProductsReturned(supplierId): Observable<ReturnedProductResponse> {
    return this.http.post<ReturnedProductResponse>(this.commandBaseUrl + '/rejected-products', {supplierId}).pipe(catchError(this.handleError<any>()));
  }

  loadProductReturnAllReadyProcessed(): Observable<ReturnedProductResponse> {
    return this.http.get<ReturnedProductResponse>(this.commandBaseUrl + '/product-return-already-processed').pipe(catchError(this.handleError<any>()));
  }

  loadCommandAndAvoirs(commandAvoirRequest): Observable<CommandAvoirResponse> {
    return this.http.post<CommandAvoirResponse>(this.commandBaseUrl + '/commands-and-avoirs', {
      "dateRange": {
        "startDate": commandAvoirRequest.dateRange.startDate,
        "endDate": commandAvoirRequest.dateRange.endDate
      }, "supplierId": commandAvoirRequest.supplierId
    }).pipe(catchError(this.handleError<any>()));
  }

  loadSupplierFactureByCategory(supplierId: string): Observable<FactureByCategoryResponse> {
    return this.http.get<FactureByCategoryResponse>(this.commandBaseUrl + '/reglement-fournisseur/facturation/' + supplierId).pipe(catchError(this.handleError<any>()));
  }

  validateFacture(facture): Observable<BaseModel> {
    return this.http.post(this.commandBaseUrl + '/create-facture', {...facture}).pipe(catchError(this.handleError<any>()));
  }

  private handleError<T>(result?: T) {
    return (response: any): Observable<T> => {
      console.log(response); // log to console instead
      this.store.dispatch(fromCoreActions.onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: response.statusText.toString().concat(': ').concat(response.error.message)
      }));
      return of(result as T);
    };
  }
}
