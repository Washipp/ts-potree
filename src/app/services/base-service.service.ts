import { Injectable } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseServiceService {

  readonly maxTries: number = 10;

  baseUrl: string = 'http://127.0.0.1:5000/';

  protected constructor() { }


  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      console.error(error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
