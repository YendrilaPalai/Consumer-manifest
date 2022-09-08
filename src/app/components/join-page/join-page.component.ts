import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { SplitwindowService } from 'src/app/services/splitwindow.service';
import { Join } from 'src/app/interface/join-interface';
import { Entity, EntityAttribute } from 'src/app/interface/split-interface';
import { JoinDataService } from 'src/app/services/join-data.service';
import { data } from 'jquery';

@Component({
  selector: 'app-join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.css'],
})
export class JoinPageComponent implements OnInit {
  operations: any = ['>', '<', '==', '!=', '>=', '<='];
  myJoinForm: FormGroup;
  leftcolumnList: any[] = [];
  rightcolumnList: any[] = [];
  outerClicked: boolean = false;
  selectedDomain: any;
  selectedDomainData: any = [];
  leftDragTableData: any[] = [];
  rightDragTableData: any[] = [];
  source: any = [];
  //togglejoincondition = 'Full Outer';
  prevoperation: any[] = [];
  newentitylist: any[] = [];
  rightTableName: Entity = {} as Entity;
  leftTableName: Entity = {} as Entity;
  button: any = 'Add';
  editClicked: boolean = false;
  indexx: number;
  dataFlag: boolean = false;
  errorFlag: boolean = false;
  rightTableNameShowHtml: any = 'Right Table';
  leftTableNameShowHtml: any = 'Left Table';
  domainnameforLeft: any = 'Left Datasource';
  domainnameforRight: any = 'Right Datasource';

  @Output() closeJoinComponent = new EventEmitter();
  @Input() editrowdata = {};
  @Input() updatedList: Join[] = [];
  @Input() editFlag: boolean;
  fullouterFlag: boolean = true;
  leftouterFlag: boolean = false;
  rightouterFlag: boolean = false;
  innerFlag: boolean = false;

  constructor(
    private router: Router,
    private _splitwindowService: SplitwindowService,
    private _joinDataService: JoinDataService
  ) {}

  ngOnInit(): void {
    this.formIntitialization();

    this._splitwindowService
      .retrieveSelectedDomainName()
      .subscribe((res: any) => {
        this.selectedDomain = res;
        this.selectedDomain.forEach((element: any) => {
          element.entities.forEach((ent: any) => {
            if (ent.displayEntityTargetPanel == true) {
              this.newentitylist.push(ent);
            }
          });
          element.entities = this.newentitylist;
          this.newentitylist = [];
        });
      });

    this.prevoperation = this.updatedList;
    this.prevoperation.length > 0
      ? (this.dataFlag = true)
      : (this.dataFlag = false);

    if (this.editFlag == true) {
      this.onClickEditJoin(this.editrowdata);
      this.dataFlag = true;
    }
  }
  formIntitialization() {
    this.myJoinForm = new FormGroup({
      leftcolumn: new FormControl('', [Validators.required]),
      rightcolumn: new FormControl('', [Validators.required]),
      operation: new FormControl('', [Validators.required]),
      joinoptions: new FormControl('Full Outer'),
    });
    this.myJoinForm.controls['leftcolumn'].disable();
    this.myJoinForm.controls['rightcolumn'].disable();
  }
  onBackClick() {
    this.closeJoinComponent.emit(false);
    this._joinDataService.passAllJoinDataToShow(this.prevoperation);
  }

  evenPredicate(item: CdkDrag<any>) {
    return item.data;
  }
  noReturnPredicate() {
    return false;
  }

  dropTableData(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.connectedTo === 'leftDragTableData') {
        this.leftDragTableData = [event.item.data];

        this.leftcolumnList = event.item.data.entityAttributes;
        this.myJoinForm.controls['leftcolumn'].enable();
        this.leftTableName = event.item.data;
        this.leftTableNameShowHtml = event.item.data.entityName;
        this.selectedDomain.forEach((domains: any) => {
          domains.entities.forEach((ent: any) => {
            if (ent.entityDesc === event.item.data.entityDesc) {
              this.domainnameforLeft = domains.domainDesc;
            }
          });
        });
      } else if (event.container.connectedTo === 'rightDragTableData') {
        this.rightDragTableData = [event.item.data];
        this.rightcolumnList = event.item.data.entityAttributes;
        this.myJoinForm.controls['rightcolumn'].enable();
        this.rightTableName = event.item.data;
        this.rightTableNameShowHtml = event.item.data.entityName;
        this.selectedDomain.forEach((domains: any) => {
          domains.entities.forEach((ent: any) => {
            if (ent.entityDesc === event.item.data.entityDesc) {
              this.domainnameforRight = domains.domainDesc;
            }
          });
        });
      }

      //this.source1 = [event.item.data];
      // this.leftcolumnList=event.item.data.entityAttributes
    }
  }

  evenPredicateSource(item: CdkDrag<any>) {
    // return item.data % 2 === 0;
    return item.data;
  }
  noReturnPredicateSource() {
    return false;
  }
  outerJoinClick() {
    this.outerClicked = true;
  }

  onClear() {
    this.initializeAllField();
  }

  changeActiveTab(data: any) {
    console.log(data, 'data');
    if (data == 'Full Outer') {
      this.fullouterFlag = true;
      this.leftouterFlag = false;
      this.rightouterFlag = false;
      this.innerFlag = false;
    } else if (data == 'Right Outer') {
      this.fullouterFlag = false;
      this.leftouterFlag = false;
      this.rightouterFlag = true;
      this.innerFlag = false;
    } else if (data == 'Left Outer') {
      this.fullouterFlag = false;
      this.leftouterFlag = true;
      this.rightouterFlag = false;
      this.innerFlag = false;
    } else if (data == 'Inner') {
      this.fullouterFlag = false;
      this.leftouterFlag = false;
      this.rightouterFlag = false;
      this.innerFlag = true;
    }
  }

  onClickAddButton() {
    this.button = 'Add';
    this.editClicked = false;

    let joindata = {} as Join;
    joindata.tableleft = {} as Entity;
    joindata.tableright = {} as Entity;

    joindata.columnleft = {} as EntityAttribute;
    joindata.columnright = {} as EntityAttribute;
    if (this.leftTableName.entityId === this.rightTableName.entityId) {
      this.errorFlag = true;
      this.myJoinForm.invalid;
    } else {
      this.errorFlag = false;
      joindata.tableright = this.rightTableName;
      joindata.tableleft = this.leftTableName;
      joindata.columnleft.attrName = this.myJoinForm.get('leftcolumn')?.value;
      joindata.columnright.attrName = this.myJoinForm.get('rightcolumn')?.value;
      joindata.operator = this.myJoinForm.get('operation')?.value;
      joindata.joinCondition = this.myJoinForm.get('joinoptions')?.value;

      this.prevoperation.push(joindata);
      this.dataFlag = true;

      this.initializeAllField();
    }
  }
  onClickUpdateButton() {
    this.button = 'Add';
    this.editClicked = false;
    let joindata = {} as Join;
    joindata.tableleft = {} as Entity;
    joindata.tableright = {} as Entity;

    joindata.columnleft = {} as EntityAttribute;
    joindata.columnright = {} as EntityAttribute;
    if (this.leftTableName.entityId === this.rightTableName.entityId) {
      this.errorFlag = true;
      this.myJoinForm.invalid;
    } else {
      this.errorFlag = false;

      joindata.tableright = this.rightTableName;
      joindata.tableleft = this.leftTableName;

      joindata.columnleft.attrName = this.myJoinForm.get('leftcolumn')?.value;
      joindata.columnright.attrName = this.myJoinForm.get('rightcolumn')?.value;
      joindata.operator = this.myJoinForm.get('operation')?.value;
      joindata.joinCondition = this.myJoinForm.get('joinoptions')?.value;

      if (joindata) {
        if (this.indexx !== -1) {
          this.prevoperation[this.indexx] = joindata;
          this.dataFlag = true;
        }
      } else {
        this.dataFlag = false;
      }
      this.initializeAllField();
    }
  }

  onClickEditJoin(row: any) {
    this.changeActiveTab(row.joinCondition);
    console.log(row, 'Row');
    this.editClicked = true;
    this.indexx = this.prevoperation.indexOf(row);
    this.button = 'Update';
    this.myJoinForm = new FormGroup({
      leftcolumn: new FormControl(row.columnleft.attrName),
      rightcolumn: new FormControl(row.columnright.attrName),
      operation: new FormControl(row.operator),
      joinoptions: new FormControl(row.joinCondition),
    });
    this.leftDragTableData = [row.tableleft];
    this.leftcolumnList = row.tableleft.entityAttributes;
    this.leftTableNameShowHtml = row.tableleft.entityName;
    this.leftTableName = row.tableleft;
    this.myJoinForm.controls['leftcolumn'].enable();
    this.selectedDomain.forEach((domains: any) => {
      domains.entities.forEach((ent: any) => {
        if (ent.entityDesc === row.tableleft.entityDesc) {
          this.domainnameforLeft = domains.domainDesc;
        }
      });
    });
    this.rightTableNameShowHtml = row.tableright.entityName;
    this.rightDragTableData = [row.tableright];
    this.rightcolumnList = row.tableright.entityAttributes;
    this.rightTableName = row.tableright;
    this.myJoinForm.controls['rightcolumn'].enable();
    this.selectedDomain.forEach((domains: any) => {
      domains.entities.forEach((ent: any) => {
        if (ent.entityDesc === row.tableright.entityDesc) {
          this.domainnameforRight = domains.domainDesc;
        }
      });
    });
  }

  onClickDeleteJoin(row: any) {
    var filtered = this.prevoperation.filter(function (value) {
      return value !== row;
    });
    this.prevoperation = filtered;
    if (this.prevoperation.length === 0) {
      this.dataFlag = false;
      this.fullouterFlag = true;
      this.leftouterFlag = false;
      this.rightouterFlag = false;
      this.innerFlag = false;
    }
  }
  initializeAllField() {
    this.formIntitialization();
    this.leftDragTableData = [];
    this.rightDragTableData = [];
    this.leftcolumnList = [];
    this.rightcolumnList = [];
    this.rightTableNameShowHtml = 'Right Table';
    this.leftTableNameShowHtml = 'Left Table';
    this.domainnameforLeft = 'Left Datasource';
    this.domainnameforRight = 'Right Datasource';
    this.fullouterFlag = true;
    this.leftouterFlag = false;
    this.rightouterFlag = false;
    this.innerFlag = false;
  }
}
