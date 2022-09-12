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

  headerHandler(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic c3ZjU09JOndZQUo0Zzh4', 
      })
    };
    return httpOptions;
  }

  getDomainData() {
    //http://localhost:1111/api/v1/domains/getDomains
    const getDomainsUrl: string = `${env.API_URL+env.api+env.version+env.domains+env.getDomains}`;
    return this.httpClient.get(getDomainsUrl,this.headerHandler())
    .pipe(
      catchError(catchError(this.errorHandler))
    );
  }

  public getDataTypes(): Observable<any> {
    return this.httpClient

      .get('assets/datatype.json')

      .pipe(catchError(this.errorHandler));
  }

  public getAllManifest(): Observable<any> {
    //http://localhost:1111/api/v1/manifest/getManifests
    const getAllManifestsUrl: string = `${env.API_URL+env.api+env.version+env.manifest+env.getManifests}`;
    return this.httpClient.get(getAllManifestsUrl,this.headerHandler())
    .pipe(
      catchError(catchError(this.errorHandler))
    );
  }

  public levelSearch(keyword:any,payload:any): Observable<any>{
      //http://localhost:1111/api/v1/domains/levelSearch/dia
      const levelSearch: string = `${env.API_URL+env.api+env.version+env.domains+env.levelSearch+keyword}`;
    return this.httpClient.post(levelSearch,payload,this.headerHandler())
    .pipe(
      catchError(catchError(this.errorHandler))
    );
  }
  
}
