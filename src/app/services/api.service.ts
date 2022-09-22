import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
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
    console.log('httperror',error);
    return throwError(error.message || 'Server Error');
  }

  headerHandler() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic c3ZjU09JOndZQUo0Zzh4',
      }),
    };
    return httpOptions;
  }

  getListOfConsumers() {
    //http://localhost:1111/api/v1/consumers
    const getListOfConsumers: string = `${
      env.API_URL + env.api + env.version + env.consumers
    }`;
    return this.httpClient
      .get(getListOfConsumers, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  getListOfDomains() {
    //http://localhost:1111/api/v1/domains
    const getListOfDomains: string = `${
      env.API_URL + env.api + env.version + env.domains
    }`;
    return this.httpClient
      .get(getListOfDomains, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  //used on create manifest page to get domains
  getSourceDataOnCreateManifest() {
    //http://localhost:1111/api/v1/domains/getDomains
    const getDomainsUrl: string = `${
      env.API_URL + env.api + env.version + env.domains + env.getDomains
    }`;
    return this.httpClient
      .get(getDomainsUrl, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  //on publish/update publish 
  publishManifest(payload: any){
    //http://localhost:1111/api/v1/manifest/publishManifest
    const publishManifestUrl :string = `${
      env.API_URL +
      env.api +
      env.version +
      env.manifest +
      env.publishManifest
    }`;
    return this.httpClient
      .post(publishManifestUrl, payload, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  //on click of save on create manifest page on success popup
  createManifest(domain: any, consumer: any, payload: any) {
    //http://localhost:1111/api/v1/manifest/consumerName/domain/domainName/createManifest
    const createManifestUrl: string = `${
      env.API_URL +
      env.api +
      env.version +
      env.manifest +
      '/' +
      consumer.consName +
      env.domain +
      '/' +
      domain.domainName +
      env.createManifest
    }`;
    return this.httpClient
      .post(createManifestUrl, payload, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  // get different types of datatypes.
  public getDataTypes(): Observable<any> {
    return this.httpClient

      .get('assets/datatype.json')

      .pipe(catchError(this.errorHandler));
  }

  //get all manifest in home page.
  public getAllManifest(): Observable<any> {
    //http://localhost:1111/api/v1/manifest/getManifests
    const getAllManifestsUrl: string = `${
      env.API_URL + env.api + env.version + env.manifest + env.getManifests
    }`;
    return this.httpClient
      .get(getAllManifestsUrl, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  //get all manifest in publish page.
  public getManifestsInPublishScreen(): Observable<any> {
    //http://localhost:1111/api/v1/manifests
    const getManifestsInPublishScreenUrl: string = `${
      env.API_URL + env.api + env.version + env.manifests
    }`;
    return this.httpClient
      .get(getManifestsInPublishScreenUrl, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }

  //search on create manifest
  public levelSearch(keyword: any, payload: any): Observable<any> {
    //http://localhost:1111/api/v1/domains/levelSearch/dia
    const levelSearch: string = `${
      env.API_URL +
      env.api +
      env.version +
      env.domains +
      env.levelSearch +
      keyword
    }`;
    return this.httpClient
      .post(levelSearch, payload, this.headerHandler())
      .pipe(catchError(this.errorHandler));
  }
}
