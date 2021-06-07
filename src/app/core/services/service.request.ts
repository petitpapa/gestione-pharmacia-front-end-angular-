import { Observable, of } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromCoreActions from '../store/core.actions';
import { MessageType } from '../models/message.type';
import { catchError } from 'rxjs/operators';

export class HttpServiceRequest<T> {
  
constructor(protected store: Store<T>) {}

  protected handleError<T>(result?: T) {
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
      return of(result as T);
    };
  }
}
