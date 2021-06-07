import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {MessageType} from '../../models/message.type';
import * as fromCoreActions from '../../store/core.actions';
import {CoreState} from '../../store/core.reducer';
import {Rayon} from '../../models/rayons';
@Injectable({
  providedIn: 'root'
})
export class RayonsService {
  baseUrl = '/rs/parametrages/';
  constructor(private http: HttpClient, private store: Store<CoreState>) { }

  loadRayons() {
    return this.http.get<Rayon>(this.baseUrl + '/rayons').pipe(catchError(this.handleError<Rayon>()))
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // log to console instead
      this.store.dispatch(fromCoreActions.onNotificationMessage({ msgType: MessageType.ERROR, msg: error.message }))
      return of(result as T);
    };
  }
}
