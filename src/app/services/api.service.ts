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
  //       'Authorization': 'Basic c3ZjU09JOndZQUo0Zzh4',
  //       'Cookie': "JSESSIONID=4FA29587D7CB5E1156AAB7D90B7CDEE9; srv_id=65370fd6ab17ad44638c5d0d6f70f3ea"
  //     })
  //   };
  //   const getDomainsUrl: string = `${env.API_URL+env.api+env.version+env.domains+env.getDomains}`;
  //   return this.httpClient.get('http://localhost:1111/vicsvc/activeSkills')
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
