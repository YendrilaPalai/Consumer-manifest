import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { SplitwindowService } from 'src/app/services/splitwindow.service';
import { Domainn, Entity, EntityAttribute, EntityAttributesMap, SplitInterface } from '../split-interface';
declare var require: any;
var domainData = require("./domain-response.json");
export interface PeriodicElement {
  name: string;
  //  weight:string;
}
export interface PeriodicElement1 {
  attrSk: number;
  attrName: string;
  attrDesc: string;
  attrComment: string;
  attrLength: number;
  position: number;
  colGrpName: string;
  colGrpLvl: string;
  entityAttributesMaps: EntityAttributesMap[];
  dataType: string;
  defaultValue: string;
  attrTags: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Sam' },
  { name: 'Hetal' },
  { name: 'Ganesh' },

];


const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    attrSk: 0,
    attrName: '',
    attrDesc: '',
    attrComment: '',
    attrLength: 0,
    position: 0,
    colGrpName: '',
    colGrpLvl: '',
    entityAttributesMaps: [],
    dataType: '',
    defaultValue: '',
    attrTags: '',
  }
];

const ELEMENT_DATA2: PeriodicElement[] = [
  { name: 'Sam' },
  { name: 'Ganesh' },

];

const ELEMENT_DATA3: PeriodicElement[] = [
  { name: 'Club1' }
];

@Component({
  selector: 'app-split-window',
  templateUrl: './split-window.component.html',
  styleUrls: ['./split-window.component.css']
})
export class SplitWindowComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  displayedColumns: string[] = ['attrName', 'position'];
  displayedColumnsOne: string[] = ['attrName', 'weight'];
  //dataSource = ELEMENT_DATA;
  //dataSource1 = ELEMENT_DATA1;
  dataSource2 = ELEMENT_DATA2;
  dataSource3 = ELEMENT_DATA3;
  dataSourceToDisplay: any = [];
  domData = domainData;
  addAllDomData: any = [];
  showRightPanel: boolean = false;
  loopOneFlag: boolean = false;
  loopTwoFlag: boolean = false;
  mappedDomains = [];
  splitInterface: SplitInterface = {} as SplitInterface;
  domains: Domainn = {} as Domainn;
  entity: Entity[] = [] as Entity[];
  entityAttribute: EntityAttribute[] = [] as EntityAttribute[];
  domainsAdd: Domainn = {} as Domainn;
  entityAdd: Entity[] = [] as Entity[];
  entityAttributeAdd: EntityAttribute[] = [] as EntityAttribute[];
  level: any;
  toppings = new FormControl('');
  selectedDomainName: any;
  selectedDomainNameTemp: any;
  indexExpanded: number = -1;
  searchResult: any;
  searchText = '';
  storedInitialResult: boolean = false;
  storeDomainNameListfromService: any[] = [];
  domainEntitybeforeSearchList: any[] = [];
  constructor(private _splitwindowService: SplitwindowService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
  }
  doDomainMappingsAll(domainName: string, entityId: string, entityAttributes: EntityAttribute[]) {
    this.domains = {} as Domainn;
    //this.addAllDomData = [];
    //console.log("The datasource is:-", domainName);
    //console.log("The table is:-", entityId);
    //console.log("The columns is:-", entityAttributes);
    let filterDomData = this.domData;
    let filterDomain = filterDomData.domains.filter((a: any) => a.domainName === domainName);
    //console.log(filterDomain);
    filterDomain[0].entities.forEach((element: any) => {
      //console.log(element);
      this.domains.domainDesc = filterDomain[0].domainDesc;
      this.domains.domainId = filterDomain[0].domainId;
      this.domains.domainName = filterDomain[0].domainName;
      this.loopOneFlag = false;
      this.loopTwoFlag = false;
      if (element.entityId === entityId) {
        if (this.addAllDomData.length > 0) {
          this.addAllDomData.forEach((el: any) => {
            if (el.domainName === filterDomain[0].domainName && this.loopTwoFlag === false) {
              this.entity = [];
              this.loopOneFlag = true;
              element.entityDisableFlag = true
              this.entity.push(element);
              this.entity.forEach((a: any) => {
                el.entities.push(a);
              })
              console.log('loopflag1', this.loopOneFlag);
            }
            if (el.domainName !== filterDomain[0].domainName && this.loopOneFlag === false &&
              this.addAllDomData.findIndex((item: any) => item.domainName === filterDomain[0].domainName) < 0) {
              this.entity = [];
              this.loopTwoFlag = true;
              element.entityDisableFlag = true;
              this.entity.push(element);
              this.domains.entities = this.entity;
              this.addAllDomData.push(this.domains);
              console.log(this.domains, 'loopflag2', this.loopOneFlag);
            }
          })
          console.log('loopflag3', this.loopOneFlag);
          //console.log(this.addAllDomData, 'final1');
        }
        else {
          element.entityDisableFlag = true
          this.entity.push(element);
          this.domains.entities = this.entity;
          //console.log('element',this.entity);
          //console.log(this.domains, 'last');
          this.addAllDomData.push(this.domains);
          //console.log(this.addAllDomData, 'final2');
        }
      }
    });
    this.showRightPanel = true;
  }

  addData(rowData: any, domainName: string, entityData: any, entityId: string, entityAttributes: EntityAttribute[]) {
    let rowDataTemp: any[] = [];
    let rowTempEntity: any[] = [];
    rowData.entityAttributeDisableFlag = true;
    var rowDataTemp1 = _.cloneDeep(rowData);
    var rowTempEntity1 = _.cloneDeep(entityData);
    rowDataTemp.push(rowDataTemp1);
    rowTempEntity.push(rowTempEntity1);
    console.log('add', rowData, entityData, entityId, entityAttributes, rowDataTemp);
    this.domainsAdd = {} as Domainn;
    let filterDomData = this.domData;
    let filterDomain = filterDomData.domains.filter((a: any) => a.domainName === domainName);
    filterDomain[0].entities.forEach((element: any) => {
      this.domainsAdd.domainDesc = filterDomain[0].domainDesc;
      this.domainsAdd.domainId = filterDomain[0].domainId;
      this.domainsAdd.domainName = filterDomain[0].domainName;
      if (element.entityId === entityId) {
        if (this.addAllDomData.length > 0) {
          this.addAllDomData.forEach((el: any) => {
            if (el.domainName === filterDomain[0].domainName) {
              this.entityAdd = [];
              el.entities.forEach((elen: any) => {
                if (elen.entityName === rowTempEntity1.entityName) {
                  console.log('elen', elen);
                  elen.entityAttributes.push(rowDataTemp1);
                  this.entityAdd.push(elen);
                  this.domainsAdd.entities = this.entityAdd;
                }
              });
            }
            if (el.domainName !== filterDomain[0].domainName &&
              this.addAllDomData.findIndex((item: any) => item.domainName === filterDomain[0].domainName) < 0) {
              this.entity = [];
              this.loopTwoFlag = true;
              element.entityDisableFlag = true;
              this.entity.push(element);
              this.domains.entities = this.entity;
              this.addAllDomData.push(this.domains);
              console.log(this.domains, 'loopflag2', this.loopOneFlag);
            }
          })
          console.log('loopflag3', this.loopOneFlag);
          //console.log(this.addAllDomData, 'final1');
        }
        else {
          rowTempEntity.forEach(ed => {
            ed.entityAttributes = rowDataTemp;
            this.entityAdd.push(ed);
            this.domainsAdd.entities = this.entityAdd;
            this.addAllDomData.push(this.domainsAdd);
          });
        }
      }
    });
    this.showRightPanel = true;
  }
  filterEntityAttributes() {

  }
  searchEntityAttributes(event: any, domainList: any) {
    if (event.target.value.length >= 3) {
      this.searchResult = domainList.entities.filter((filtered: any) =>
        filtered.entityName.includes(event.target.value)
      );
      this.selectedDomainName[0].entities = this.searchResult;
    }
    if (event.target.value.length === 1 && this.storedInitialResult === false) {
      this.domainEntitybeforeSearchList = _.cloneDeep(domainList);
      this.storedInitialResult = true;
    }
    if (event.target.value.length === 0) {
      this.selectedDomainName = this.domainEntitybeforeSearchList;
    }
  }

  changeAction(event: any) {
    this.selectedDomainName = event.value;
    this._splitwindowService.selectedDomainNameStore.subscribe((allPassedData) => {
      this.storeDomainNameListfromService = allPassedData;
    })
    if (this.storeDomainNameListfromService && this.storeDomainNameListfromService.length === 0) {
      this.selectedDomainName.forEach((d: any) => {
        d.entities.forEach((e: any) => {
          e.entityDisableFlag = false;
          e.entityAttributes.forEach((eA: any) => {
            eA.entityAttributeDisableFlag = false;
          });
        });
      });
      this._splitwindowService.selectedDomainNameStore.next(this.selectedDomainName);
    } else {
      let item = this.getObjectDiff(this.selectedDomainName, this.storeDomainNameListfromService);
    }
  }

  getObjectDiff(data: object | any, oldData: object | any) {
    const record: any = {};
    Object.keys(data).forEach((key: string) => {
      // Checks that isn't an object and isn't equal
      if (key === "domainName") {
        if (!(typeof data[key] === "object" && _.isEqual(data[key], oldData[key]))) {
          record[key] = data[key];
        }
        // If is an object, and the object isn't equal
        if ((typeof data[key] === "object" && !_.isEqual(data[key], oldData[key]))) {
          record[key] = this.getObjectDiff(data[key], oldData[key]);
        }
      }
    });
    console.log('rec', record);
    return record;
  };

}
