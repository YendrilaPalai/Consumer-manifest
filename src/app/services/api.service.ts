import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {env} from 'src/environments/environment';
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

  // getDomainData() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json',
  //       'Authorization': 'Basic c3ZjU09JOndZQUo0Zzh4'
  //     })
  //   };
  //   const getDomainsUrl: string = `${env.API_URL+env.api+env.version+env.domains+env.getDomains}`;
  //   return this.httpClient.get(getDomainsUrl, httpOptions)
  //   .pipe(
  //     catchError(catchError(this.errorHandler))
  //   );
  // }

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
