import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplitwindowService } from 'src/app/services/splitwindow.service';
import cronstrue from 'cronstrue';
declare var require: any;
var publishData = require('src/assets/publish.json');

var publishNewData=require('src/assets/publishnew.json');

// interface USERS {
//   name: string;
//   schedule: string;
//   publish: string;
//   status: boolean;
// }

interface newUSERS{
  entityName:string;
  cronExpr:string;
  publish:string;
  flag:boolean;
  startDate:string;

  endDate:string;
}

@Component({
  selector: 'app-publish-page',
  templateUrl: './publish-page.component.html',
  styleUrls: ['./publish-page.component.css'],
})
export class PublishPageComponent implements OnInit {
  operations: any = [
    { id: 3432, name: 'Show All' },
    { id: 3442, name: 'Show Published' },
    { id: 3352, name: 'Show Unpublished' },
  ];
  dropdown2 = '';
  tabDat: any = [];
  searchManifest: string = '';
  selectedpublishData:any;
  startDate:any;

  endDate:any;

 // Users: USERS[] = publishData;

  newPublish:newUSERS[]=publishNewData;
  cronListVal:any=[];
  publishListVal:any;
  entityName:any;

  @Input() schedulepageFlag: any;
  @Input() crondatafromschedule: any;
  @Input() advancedTabData: boolean;
  
  constructor(private router: Router,private _splitwindowService: SplitwindowService) {}

  ngOnInit(): void {
    console.log(this.schedulepageFlag+"___"+this.crondatafromschedule)

    console.log(publishData);
   console.log(publishNewData);
   this.newPublish=[];
   publishNewData.map((x:any)=>{
    this.cronListVal=x.cronExpr;
    this.publishListVal = cronstrue.toString(this.cronListVal);
    this.entityName=x.entityName;
    this.startDate=x.startDate;
  this.endDate=x.endDate;
 //this.publishListVal.push(readable);
 this.newPublish.push({entityName:this.entityName,cronExpr:this.cronListVal,publish:this.publishListVal,flag:true,startDate:this.startDate,endDate:this.endDate});
 console.log(this.newPublish);
   //let myArray = this.publishListVal.split(',');
    // this.publishListVal = readable;
   // console.log(this.publishListVal);
  })



  //Data comming from schedule page
  if (this.schedulepageFlag == true) {
    this._splitwindowService
      .retrieveStoreSelectedCronData()
      .subscribe((res: any) => {
        console.log('schedule comp', res);
        if (res.advancedTabClicked == false) {
          this.newPublish.unshift({
            entityName: 'MANIFEST',
            cronExpr: res.crondataschedule,
            publish: cronstrue.toString(res.crondataschedule),
            flag: true,
            startDate:res.crondataschedule,
            endDate:res.crondataschedule
            
          });
        } else {
          this.newPublish.unshift({
            entityName: 'MANIFEST',
            cronExpr: 'Custom',
            publish: cronstrue.toString(res.crondataschedule),
            flag: true,
            startDate:res.crondataschedule,
            endDate:res.crondataschedule
          });
        }
      });

    console.log(this.newPublish);
  }


  }

  onBackClick() {
    this.router.navigate(['/home-page']);
  }

  editPublish(event:any){
    this.router.navigate(['/schedule']);
    console.log(event);
    this.selectedpublishData=event;
    this._splitwindowService.storeSelectedPublishData(
      this.selectedpublishData
    );
  }
  updateActiveStatus(element: any) {
    element.flag = !element.flag;
  }

  changeAction(event: any) {
    // console.log(event.target.value);
    // if (event.target.value === 'Show Unpublished') {
    //   this.Users = publishData;
    //   this.tabDat = this.Users.filter((x) => x.publish === 'Not available');
    //   this.Users = [];
    //   this.Users = this.tabDat;
    // } else if (event.target.value === 'Show Published') {
    //   this.Users = publishData;
    //   this.tabDat = this.Users.filter((x) => x.status === true);
    //   this.Users = [];
    //   this.Users = this.tabDat;
    // } else {
    //   this.Users = publishData;
    // }
  }
}
