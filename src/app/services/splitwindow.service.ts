import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SplitwindowService {
  selectedDomainNameStore: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  storeEntityAttributeSearch: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  publishManifestData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  schedulecrondata: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() {}

  storeSelectedDomainName(passedData: any) {
    console.log('ser', passedData);
    this.selectedDomainNameStore.next(passedData);
  }
  // here instead of retrieve like this you can directly subscribe the property in your components
  retrieveSelectedDomainName() {
    return this.selectedDomainNameStore;
  }

  storeSearchResultBeforeFilter(passedData: any) {
    console.log('st', passedData);
    this.storeEntityAttributeSearch.next(passedData);
  }

  retrieveStoreSearchResultBeforeFilter() {
    return this.storeEntityAttributeSearch;
  }

  storeSelectedPublishData(passedData: any) {
    console.log('pt', passedData);
    this.publishManifestData.next(passedData);
  }

  retrieveStoreSelectedPublishData() {
    return this.publishManifestData;
  }

  storeSelectedCronData(passedData: any) {
    console.log('pt', passedData);

    this.schedulecrondata.next(passedData);
  }

  retrieveStoreSelectedCronData() {
    return this.schedulecrondata;
  }
}
