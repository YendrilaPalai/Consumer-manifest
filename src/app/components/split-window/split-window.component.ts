import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ApiService } from 'src/app/services/api.service';
import { SplitwindowService } from 'src/app/services/splitwindow.service';

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

  constructor(
    private _splitwindowService: SplitwindowService,
    private _apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._apiService.getDomainData().subscribe((response: any) => {
      this.domData = response;
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
    this.showNoDatasourceContent = false;
    selectedDomainData.displayDomainTargetPanel = true;
    selectedEntityData.displayEntityTargetPanel = true;
    let isAttrFlagDisabled: number = 0;
    selectedEntityData.entityAttributes.forEach((eachAttr: any) => {
      
      if (eachAttr.attrName === selectedAttrData.attrName) {
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
    console.log('len',event.value.length);
    this.showRightPanel = event.value.length > 0 ? true : false;
    let addedSelectorsCount: number = 0;
    event.value.forEach((d: any) => {
      addedSelectorsCount = d.displayDomainTargetPanel === true ? addedSelectorsCount+=1 : addedSelectorsCount;
      if (d.selected !== true) {
        d.selected = true;
        d.displayDomainTargetPanel = false;
        d.entities.forEach((e: any) => {
          e.entityDisableFlag = false;
          e.displayEntityTargetPanel = false;
          e.entityAttributes.forEach((eA: any) => {
            eA.entityAttributeDisableFlag = false;
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
    this.showNoDatasourceContent=addedSelectorsCount===0?true: false;
  }
  // checks whether an object contains the list or not and return non exist list .
  containsObject(obj: any[], list: any[]) {
    return obj.filter(
      (o1) => !list.some((o2) => o1.domainName === o2.domainName)
    );
  }

  //on click of back button
  onBackClick() {
    this.router.navigate(['/home-page']);
  }

  //on click of clearall button on right pannel.
  clearAllSelectors() {
    this.selectedDomainName.forEach((clearEachSelected: any) => {
      //if (clearEachSelected.selected === true) {
        clearEachSelected.entities.forEach((eachEntity:any) => {
          //if(eachEntity.entityDisableFlag === true){
            eachEntity.entityAttributes.forEach((eachAttr:any) => {
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
    console.log(
      'ondelete',
      selectedAttrData,
      selectedEntityData,
      selectedDomainData
    );
    let isAttrFlagDisabled: number = 0;
    let isEntityFlagDisabled: number = 0;
    selectedEntityData.entityDisableFlag = false;
    selectedEntityData.entityAttributes.forEach((eachAttr: any) => {
      if (eachAttr.attrName === selectedAttrData.attrName) {
        eachAttr.entityAttributeDisableFlag = false;
      }
      if (eachAttr.entityAttributeDisableFlag === true) {
        isAttrFlagDisabled += 1;
      }
    });
    console.log('count',isAttrFlagDisabled);
    if(isAttrFlagDisabled === 0){
      selectedEntityData.entityDisableFlag = false;
      selectedEntityData.displayEntityTargetPanel = false;
    }
    selectedDomainData.entities.forEach((eachEntity:any) => {
      if(eachEntity.displayEntityTargetPanel){
        isEntityFlagDisabled += 1;
      }
    });
    selectedDomainData.displayDomainTargetPanel = isEntityFlagDisabled<1?false:true;
    //selectedDomainData.selected = isEntityFlagDisabled<1?false:true;
    console.log('selectedDo',selectedDomainData);
  }
}
