import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplitwindowService {
  selectedDomainNameStore: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  storeEntityAttributeSearch: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor() { }

  storeSelectedDomainName(passedData:any) {
    console.log('ser',passedData);
    this.selectedDomainNameStore.next(passedData);
  }
  // here instead of retrieve like this you can directly subscribe the property in your components
  retrieveSelectedDomainName() {
    return this.selectedDomainNameStore;
  }

  storeSearchResultBeforeFilter(passedData:any){
    console.log('st',passedData);
    this.storeEntityAttributeSearch.next(passedData);
  }

  retrieveStoreSearchResultBeforeFilter(){
    return this.storeEntityAttributeSearch;
  }
}
