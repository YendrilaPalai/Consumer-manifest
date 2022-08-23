import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  /**

   * function to return error message

   * @param error error as input

   * @returns error message

   */

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error');
  }

  public getDomainData(): Observable<any> {
    return this.httpClient

      .get('assets/domain-response1.json')

      .pipe(catchError(this.errorHandler));
  }

  public getDataTypes(): Observable<any> {
    return this.httpClient

      .get('assets/datatype.json')

      .pipe(catchError(this.errorHandler));
  }

  public getAllManifest(): Observable<any> {
    return this.httpClient

      .get('assets/getAllManifests1.json')

      .pipe(catchError(this.errorHandler));
  }
}
