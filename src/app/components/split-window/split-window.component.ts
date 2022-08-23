import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ApiService } from 'src/app/services/api.service';
import { SplitwindowService } from 'src/app/services/splitwindow.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-split-window',
  templateUrl: './split-window.component.html',
  styleUrls: ['./split-window.component.css'],
})
export class SplitWindowComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('table') table: MatTable<Element>;
  displayedColumns: string[] = ['attrName', 'position'];
  domData: any;
  level: any;
  toppings = new FormControl('');
  selectedDomainName: any = [];
  searchResult: any;
  searchText = '';
  storeDomainNameListfromService: any[] = [];
  showRightPanel: boolean = false;
  showNoDatasourceContent: boolean = true;
  listofdatatype: any[] = [];
  enableFields: number = -1;
  namechangeattrStr: any;
  addedoperation: any[] = [];
  prevoperation: any;
  dataFlag: boolean = false;
  disableFilterBtn: boolean = true;
  disableClearAllBtn: boolean = true;

  constructor(
    private _splitwindowService: SplitwindowService,
    private _apiService: ApiService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._apiService.getDomainData().subscribe((response: any) => {
      this.domData = response;
    });

    this._apiService.getDataTypes().subscribe((response: any) => {
      console.log('data', response.listofdatatype);
      this.listofdatatype = response.listofdatatype;
    });
  }

  //on click addall of each entity.
  onAddAllClick(selectedDomainData: any, selectedEntityData: any) {
    selectedEntityData.entityAttributes.forEach((eachAttr: any) => {
      this.onAddClick(eachAttr, selectedEntityData, selectedDomainData);
    });
  }

  //on click add of each attribute.
  onAddClick(
    selectedAttrData: any,
    selectedEntityData: any,
    selectedDomainData: any
  ) {
    this.disableFilterBtn = false;
    this.disableClearAllBtn = false;
    this.showNoDatasourceContent = false;
    selectedDomainData.displayDomainTargetPanel = true;
    selectedEntityData.displayEntityTargetPanel = true;
    let isAttrFlagDisabled: number = 0;
    selectedEntityData.entityAttributes.forEach((eachAttr: any) => {
      if (eachAttr.attrSk === selectedAttrData.attrSk) {
        eachAttr.entityAttributeDisableFlag = true;
      }
      if (eachAttr.entityAttributeDisableFlag === false) {
        isAttrFlagDisabled += 1;
      }
    });
    selectedEntityData.entityDisableFlag =
      isAttrFlagDisabled < 1 ? true : false;
  }

  //on change with multi select dropdown for datasources.
  changeAction(event: any) {
    this.showRightPanel = event.value.length > 0 ? true : false;
    //let addedSelectorsCount: number = 0;
    let domainsonrightpanel: number = 0;
    event.value.forEach((d: any) => {
      // addedSelectorsCount =
      //   d.displayDomainTargetPanel === true
      //     ? (addedSelectorsCount += 1)
      //     : addedSelectorsCount;
      if (d.selected !== true) {
        d.selected = true;
        d.displayDomainTargetPanel = false;
        d.entities.forEach((e: any) => {
          e.entityDisableFlag = false;
          e.displayEntityTargetPanel = false;
          e.entityAttributes.forEach((eA: any) => {
            eA.entityAttributeDisableFlag = false;
            if (!eA.dataType) {
              eA.dataType = 'string';
            }
          });
        });
        this.selectedDomainName.push(d);
      }
    });
    if (this.selectedDomainName.length > event.value.length) {
      let newDomainlist = this.containsObject(
        this.selectedDomainName,
        event.value
      );
      newDomainlist.forEach((removeitem) => {
        const index = this.selectedDomainName.indexOf(removeitem);
        if (index > -1) {
          this.selectedDomainName.splice(index, 1);
          removeitem.selected = false;
        }
      });
    }
    //this.showNoDatasourceContent = addedSelectorsCount === 0 ? true : false;
    this.selectedDomainName.forEach((eachdom: any) => {
      if (eachdom.displayDomainTargetPanel === true) {
        domainsonrightpanel += 1;
      }
    });
    this.showNoDatasourceContent = domainsonrightpanel < 1 ? true : false;
    this.disableClearAllBtn = domainsonrightpanel < 1 ? true : false;
    this.disableFilterBtn = domainsonrightpanel < 1 ? true : false;
  }
  // checks whether an object contains the list or not and return non exist list .
  containsObject(obj: any[], list: any[]) {
    return obj.filter((o1) => !list.some((o2) => o1.domainId === o2.domainId));
  }

  //on click of back button
  onBackClick() {
    this.disableFilterBtn = true;
    this.disableClearAllBtn = true;
    this.router.navigate(['/home-page']);
  }

  //on click of clearall button on right pannel.
  clearAllSelectors() {
    this.disableFilterBtn = true;
    this.disableClearAllBtn = true;
    this.selectedDomainName.forEach((clearEachSelected: any) => {
      //if (clearEachSelected.selected === true) {
      clearEachSelected.entities.forEach((eachEntity: any) => {
        //if(eachEntity.entityDisableFlag === true){
        eachEntity.entityAttributes.forEach((eachAttr: any) => {
          //if(eachAttr.entityAttributeDisableFlag === true){
          eachAttr.entityAttributeDisableFlag = false;
          eachEntity.entityDisableFlag = false;
          eachEntity.displayEntityTargetPanel = false;
          clearEachSelected.selected = false;
          clearEachSelected.displayDomainTargetPanel = false;
          this.showNoDatasourceContent = true;
          //}
        });
        //}
      });
      //}
    });
  }

  //on click of delete icon of attribute
  deleteEntityAttribute(
    selectedAttrData: any,
    selectedEntityData: any,
    selectedDomainData: any
  ) {
    let isAttrFlagDisabled: number = 0;
    let isEntityFlagDisabled: number = 0;
    let domainsonrightpanel: number = 0;
    selectedEntityData.entityDisableFlag = false;
    selectedEntityData.entityAttributes.forEach((eachAttr: any) => {
      if (eachAttr.attrSk === selectedAttrData.attrSk) {
        eachAttr.entityAttributeDisableFlag = false;
      }
      if (eachAttr.entityAttributeDisableFlag === true) {
        isAttrFlagDisabled += 1;
      }
    });
    console.log('count', isAttrFlagDisabled);
    if (isAttrFlagDisabled === 0) {
      selectedEntityData.entityDisableFlag = false;
      selectedEntityData.displayEntityTargetPanel = false;
    }
    selectedDomainData.entities.forEach((eachEntity: any) => {
      if (eachEntity.displayEntityTargetPanel) {
        isEntityFlagDisabled += 1;
      }
    });
    selectedDomainData.displayDomainTargetPanel =
      isEntityFlagDisabled < 1 ? false : true;
    this.selectedDomainName.forEach((eachdom: any) => {
      if (eachdom.displayDomainTargetPanel === true) {
        domainsonrightpanel += 1;
      }
    });
    this.showNoDatasourceContent = domainsonrightpanel < 1 ? true : false;
    this.disableFilterBtn = domainsonrightpanel < 1 ? true : false;
    this.disableClearAllBtn = domainsonrightpanel < 1 ? true : false;
  }

  // on click of edit icon of attribute level.
  editEntityAttribute(attr: any) {
    this.enableFields = attr.attrSk;
    this.namechangeattrStr = attr.attrName;
  }

  // on save of edited attribute.
  onSave(event: any, namechangeattrStr: any) {
    this.enableFields = -1;
    event.attrName = namechangeattrStr;
  }

  //opening the filter dialog

  openFilterDialog() {
    if(this.addedoperation.length === 0){
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '82%',

      height: '83%',

      data: { sourcedata: this.selectedDomainName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result.operation);
      if (result && result.operation) {
        this.prevoperation = result.operation;
        this.addedoperation.push(result.operation);
        this.dataFlag = true;
      }
    });}
    else {this.onClickAdd();}
  }

  onClickAdd() {
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '82%',
      height: '83%',
      data: {
        sourcedata: this.selectedDomainName,
        prevoperation: this.addedoperation,
        addClicked: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result.operation);
      if (result && result.operation) {
        this.prevoperation = result.operation;
        this.addedoperation.push(result.operation);
        this.dataFlag = true;
      }
    });
  }

  onClickEditFilter(filterrow: any) {
    let indexx = this.addedoperation.indexOf(filterrow);
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '82%',
      height: '83%',

      data: {
        sourcedata: this.selectedDomainName,
        filterrow: filterrow,
        editClicked: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result.operation);
      if (result && result.operation) {
        if (indexx !== -1) {
          this.addedoperation[indexx] = result.operation;
        }
        this.dataFlag = true;
      }
    });
  }

  onClickDeleteFilter(filterrow: any) {
    var filtered = this.addedoperation.filter(function (value) {
      return value !== filterrow;
    });
    this.addedoperation = filtered;
    if (this.addedoperation.length === 0) {
      this.dataFlag = false;
    }
  }
}
