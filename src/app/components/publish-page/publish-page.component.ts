import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplitwindowService } from 'src/app/services/splitwindow.service';
import cronstrue from 'cronstrue';
import { Constants } from 'src/app/constants/constants';
import { EntitySave } from 'src/app/interface/savemanifest-interface';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/common/snackbar/snackbar.component';
////declare var require: any;
//var publishData = require('src/assets/publish.json');

//var publishNewData = require('src/assets/publishnew.json');

// interface USERS {
//   name: string;
//   schedule: string;
//   publish: string;
//   status: boolean;
// }

// interface NewSchedule {
//   entityName: string;
//   cronExpr: string;
//   publish: string;
//   flag: boolean;
//   startDate: string;
//   endDate: string;
//   editedFlag: boolean;
//   editedIndex: any;
// }

@Component({
  selector: 'app-publish-page',
  templateUrl: './publish-page.component.html',
  styleUrls: ['./publish-page.component.css'],
})
export class PublishPageComponent implements OnInit {
  const:any={};
  operations: any = [
    { id: 1, name: 'Show All' },
    { id: 2, name: 'Show Active' },
    { id: 3, name: 'Show InActive' },
  ];
  scheduleStatus = '';
  //tabDat: any = [];
  searchManifest: string = '';
  selectedpublishData: any;
  startDate: any;
  endDate: any;

  // Users: USERS[] = publishData;

  //newPublish: NewSchedule[] = publishNewData;
  //newPublishData: NewSchedule[] = [];
  publishData: EntitySave[] = [];
  loadSpinner: boolean = false;
  cronListVal: any = [];
  publishListVal: any;
  entityName: any;

  @Input() schedulepageFlag: any;
  @Input() crondatafromschedule: any;
  @Input() advancedTabData: boolean;

  constructor(
    private router: Router,
    private _splitwindowService: SplitwindowService,
    private _apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getManifestsInPublishScreen();
    this.const["editTooltip"]=Constants.editPublish;
    this.const["deleteTooltip"]=Constants.deletePublish;




    ///later
    // this.publishData = [];
    // publishData.map((x: any) => {
    //   this.cronListVal = x.cronExpr;
    //   this.publishListVal = cronstrue.toString(this.cronListVal);
    //   this.entityName = x.manifestName;
    //   this.startDate = x.startDate;
    //   this.endDate = x.endDate;
    //   //this.publishListVal.push(readable);
    //   this.newPublishData.push({
    //     entityName: this.entityName,
    //     cronExpr: this.cronListVal,
    //     publish: this.publishListVal,
    //     flag: true,
    //     startDate: this.startDate,
    //     endDate: this.endDate,
    //     editedFlag: false,
    //     editedIndex: '',
    //   });
    //   //let myArray = this.publishListVal.split(',');
    //   // this.publishListVal = readable;
    //   // console.log(this.publishListVal);
    // });

    //Data comming from schedule page
    if (this.schedulepageFlag == true) {
      this._splitwindowService
        .retrieveStoreSelectedCronData()
        .subscribe((res: any) => {
          if (res != null) {
            if (res.crondataschedule.editedFlag == false) {
              // this.newPublishData.unshift({
              //   entityName: res.crondataschedule.entityName,
              //   cronExpr: res.crondataschedule.cronExpr,
              //   publish: cronstrue.toString(res.crondataschedule.cronExpr),
              //   flag: res.crondataschedule.flag,
              //   startDate: res.crondataschedule.startDate,
              //   endDate: res.crondataschedule.endDate,
              //   editedFlag: res.crondataschedule.editedFlag,
              //   editedIndex: '',
              // });
            } else {
              // let editdata: NewSchedule = {} as NewSchedule;
              // editdata.entityName = res.crondataschedule.entityName;
              // editdata.cronExpr = res.crondataschedule.cronExpr;
              // editdata.publish = cronstrue.toString(
              //   res.crondataschedule.cronExpr
              // );
              // editdata.flag = res.crondataschedule.flag;
              // editdata.startDate = res.crondataschedule.startDate;
              // editdata.endDate = res.crondataschedule.endDate;
              // editdata.editedFlag = false;
              // editdata.editedIndex = res.crondataschedule.editedIndex;

              // if (res.crondataschedule.editedIndex !== -1) {
              //   this.newPublishData[res.crondataschedule.editedIndex] = editdata;
              // }

              // console.log(this.newPublishData, 'finaleditlist');
              // this.newPublish.unshift({
              //   entityName: res.crondataschedule.entityName,
              //   cronExpr: res.crondataschedule.cronExpr,
              //   publish: cronstrue.toString(res.crondataschedule.cronExpr),
              //   flag: res.crondataschedule.flag,
              //   startDate: res.crondataschedule.startDate,
              //   endDate: res.crondataschedule.endDate,
              //   editedFlag: res.crondataschedule.editedFlag,
              //   editedIndex: '',
              // });
            }
          }
        });
    }
  }

  onBackClick() {
    this.router.navigate(['/home-page']);
  }

  getManifestsInPublishScreen(){
    this.loadSpinner = true;
    this._apiService.getManifestsInPublishScreen().subscribe((response: any) => {
      console.log('publishdata',response);
    this.publishData = response;
    this.loadSpinner = false;
  });}

  cronToReadable(cronExpression:any){
    return cronExpression ? cronstrue.toString(cronExpression) : '';
  }

  onPublishClick(manifestdetails:any) {
    console.log('mani',manifestdetails);
    localStorage.setItem('manifestDetails', manifestdetails);
    this.router.navigate(['/schedule']);
  }

  editPublish(event: any, index: any) {
    console.log(event,"event")
    this.router.navigate(['/schedule']);
    event.editedFlag = true;
    event.editedIndex = index;
    this.selectedpublishData = event;
    console.log('editedrow',this.selectedpublishData);
    this._splitwindowService.storeSelectedPublishData(this.selectedpublishData);
  }
  updateActiveStatus(element: any,event:any) {
    console.log('row',element,event);
    let rowData: EntitySave[] = [];
    element.status = (event.checked) ? "Active" : "InActive";
    rowData.push(element);
    this._apiService
    .publishManifest(rowData)
    .subscribe((response: any) => {
      console.log('data', response);
      if (response) {
        this.successMessageInSnackbar("Manifest Status has been updated");
      }
    });

    //element.flag = !element.flag;
  }

  successMessageInSnackbar(successmsg: any) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: successmsg,
      panelClass: ['custom-success'],
      duration: 1000000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'right', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
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

  onClickDeletePublish(rowDetails: any, index: any) {

    // var filtered = this.newPublishData.filter(function (value) {
    //   return value !== row;
    // });
    // this.newPublishData = filtered;
  }
}
