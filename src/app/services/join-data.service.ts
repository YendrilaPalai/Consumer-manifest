import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Join } from '../interface/join-interface';

@Injectable({
  providedIn: 'root'
})
export class JoinDataService {

  allJoinDataToShow: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor() { }

  passAllJoinDataToShow(passedData:Join[]) {
    this.allJoinDataToShow.next(passedData);
  }
  retrieveAllJoinDataToShow() {
    return this.allJoinDataToShow;
  }
  
}
