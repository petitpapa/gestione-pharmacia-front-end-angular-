import { Injectable } from '@angular/core';
import {HttpServiceRequest} from "./service.request";
import {CoreState} from "../store/core.reducer";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {catchError} from "rxjs/operators";
import {PharmaConfigResponse} from "../models/pharma-config-response";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PharmaConfigService extends HttpServiceRequest{
  baseUrl = '/rs/pharma-init?variableName=';

  constructor(private http: HttpClient) {
    super();
  }

  loadVariable(name: string): Observable<PharmaConfigResponse>{
    return this.http.get<PharmaConfigResponse>(this.baseUrl + name).pipe(catchError(this.handleError()));
  }
}
