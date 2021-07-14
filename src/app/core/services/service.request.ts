import { Observable, of } from "rxjs";
import { MessageType } from "../models/message.type";
import { HttpErrorResponse } from "@angular/common/http";

export abstract class HttpServiceRequest {
  constructor() {}

  protected handleError() {
    return (response: HttpErrorResponse): Observable<any> => {
     
      if (!response?.ok) {
       
        let errorDisplay = response.statusText
          .toString()
          .concat(": ")
          .concat(response.error.message);
        if (response?.error?.errorMessage) {
          errorDisplay = response.error.errorMessage;
        }
        return of({
          msgType: MessageType.ERROR,
          msg: errorDisplay,
        });
      }
    };
  }
}
