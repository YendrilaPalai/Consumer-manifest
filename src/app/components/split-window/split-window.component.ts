import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Join } from 'src/app/interface/join-interface';
import { ApiService } from 'src/app/services/api.service';
import { JoinDataService } from 'src/app/services/join-data.service';
import { SplitwindowService } from 'src/app/services/splitwindow.service';
import { FilterComponent } from '../filter/filter.component';
import {
  EntityAttributeSave,
  EntitySave,
} from 'src/app/interface/savemanifest-interface';
import { SuccessPopupComponent } from 'src/app/common/success-popup/success-popup.component';

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
  disableJoinBtn: boolean = true;
  disableClearAllBtn: boolean = true;
  saveManifestList: any[] = [];
  openSplitComponent: boolean = true;
  openJoinComponent: boolean = false;
  addedJoinoperation: Join[] = [];
  sendtheeditedData: any;
  sendthewholwjoinList: Join[] = [];
  editClickedForJoin: boolean = false;
  selecteddomainforjoin: any[] = [];
  disablePublishbtn: boolean = true;

  constructor(
    private _splitwindowService: SplitwindowService,
    private _apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private _joinDataService: JoinDataService
  ) {}

  ngOnInit(): void {
    this._apiService.getDomainData().subscribe((response: any) => {
      console.log('res', response);
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
    let count =0;
    this.selectedDomainName.forEach((eachdom:any) => {
      if(eachdom.displayDomainTargetPanel){
        eachdom.entities.forEach((eachen:any) => {
          if(eachen.displayEntityTargetPanel){count += 1;}
        });  
      }
    });
    this.disableJoinBtn = count >= 2 ? false : true;
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
        if (this.addedoperation) {
          const indexOfObject = this.addedoperation.findIndex((object) => {
            return object.datasource.domainName === removeitem.domainName;
          });
          if (indexOfObject !== -1) {
            this.addedoperation.splice(indexOfObject, 1);
          }
          if (this.addedoperation.length === 0) {
            this.addedoperation = [];
            this.dataFlag = false;
          }
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
    this.disableJoinBtn = domainsonrightpanel < 1 ? true : false;
  }
  // checks whether an object contains the list or not and return non exist list .
  containsObject(obj: any[], list: any[]) {
    return obj.filter((o1) => !list.some((o2) => o1.domainId === o2.domainId));
  }

  //on click of back button
  onBackClick() {
    this.disableFilterBtn = true;
    this.disableJoinBtn = true;
    this.disableClearAllBtn = true;
    this.router.navigate(['/home-page']);
  }

  //on click of clearall button on right pannel.
  clearAllSelectors() {
    this.disableFilterBtn = true;
    this.disableJoinBtn = true;
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
    //filters div clear
    this.addedoperation = [];
    this.dataFlag = false;
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

  //on click of search button
  onSearch(searchkeys: any) {
    console.log('sear',searchkeys);
    let searchPayload = { "domains" : this.selectedDomainName}
    this._apiService.levelSearch(searchkeys,searchPayload).subscribe((response: any) => {
     console.log('searres',response);
     //this.changeAction(response.domains);
     //this.selectedDomainName = response.domains;
    });
  }

  //success popup

  opensuccesspopup() {
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      width: '30%',
      height: '40%',
      data: {
        popupdata: 'created',
      },
    });
    dialogRef.afterClosed().subscribe((result) => { console.log('hfg',result);if(result?.fileName){this.onCreateManifest(result)}});
  }

  //on click of create manifest
  onCreateManifest(res:any) {
    console.log('resultfile',res);
    this.disablePublishbtn = false;
    this.selectedDomainName.forEach((eachTarDomain: any) => {
      if (eachTarDomain.displayDomainTargetPanel) {
        let saveEntityList = {} as EntitySave;
        eachTarDomain.entities.forEach((eachEntity: any) => {
          if (eachEntity.displayEntityTargetPanel) {
            saveEntityList.entitySk = eachEntity.entitySk;
            saveEntityList.entityId = eachEntity.entityId;
            saveEntityList.entityName = eachEntity.entityName;
            saveEntityList.entityDesc = eachEntity.entityDesc;
            saveEntityList.entitySrc = eachEntity.entitySrc;
            saveEntityList.sourceType = eachEntity.sourceType;
            let saveAttributesList: EntityAttributeSave[] =
              [] as EntityAttributeSave[];
            //saveAttributesList = [] as EntityAttributeSave[];
            let attrlist = {} as EntityAttributeSave;
            eachEntity.entityAttributes.forEach((eachAttr: any) => {
              if (eachAttr.entityAttributeDisableFlag) {
                attrlist.attrSk = eachAttr.attrSk;
                attrlist.attrName = eachAttr.attrName;
                attrlist.attrDesc = eachAttr.attrDesc;
                attrlist.attrComment = eachAttr.attrComment;
                attrlist.entitySrc = eachEntity.entitySrc;
                attrlist.domainSrc = eachTarDomain.domainName;
                attrlist.dataType = eachAttr.dataType;
                attrlist.attrLength = eachAttr.attrLength;
                attrlist.position = eachAttr.position;
                attrlist.colGrpName = eachAttr.colGrpName;
                attrlist.colGrpLvl = eachAttr.colGrpLvl;
                attrlist.createTs = eachAttr.createTs;
                attrlist.lastUpdtTs = eachAttr.lastUpdtTs;
                attrlist.tgtValSrcJson =  eachAttr.attrDesc;
                saveAttributesList.push(attrlist);
                attrlist = {} as EntityAttributeSave;
              }
            });
            saveEntityList.entityAttributes = saveAttributesList;
            this.saveManifestList.push(saveEntityList);
            saveEntityList = {} as EntitySave;
          }
        });
      }
    });
    console.log(
      'save manifest',
      this.selectedDomainName,
      this.saveManifestList
    );
  }

  //opening the filter dialog
  openFilterDialog() {
    if (this.addedoperation.length === 0) {
      const dialogRef = this.dialog.open(FilterComponent, {
        width: '82%',

        height: '83%',

        data: { sourcedata: this.selectedDomainName },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.operation) {
          this.prevoperation = result.operation;
          this.addedoperation.push(result.operation);
          this.dataFlag = true;
        }
      });
    } else {
      this.onClickAdd();
    }
  }

  onPublishClick(){
    this.router.navigate(['/schedule']);
  }

  onJoinClick() {
    let domdatatoloop = [];
    this.selecteddomainforjoin = [];
    domdatatoloop = _.cloneDeep(this.selectedDomainName);
    domdatatoloop.forEach((dom: any) => {
      if (dom.displayDomainTargetPanel == true) {
        this.selecteddomainforjoin.push(dom);
      }
    });

    if (this.selecteddomainforjoin.length > 0) {
      this._splitwindowService.storeSelectedDomainName(
        this.selecteddomainforjoin
      );
      this.editClickedForJoin = false;
      this.openJoinComponent = true;
      this.openSplitComponent = false;
      this.sendtheeditedData = '';
      this.sendthewholwjoinList = this.addedJoinoperation;
    }

    // this.router.navigate(['/join-page']);
  }
  opentheJoinComp(flag: boolean) {
    this.openJoinComponent = flag;
    this.openSplitComponent = true;

    this._joinDataService.allJoinDataToShow.subscribe((allPassedData) => {
      this.addedJoinoperation = allPassedData;
    });
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
  onClickEditJoin(joinrow: any) {
    this.sendtheeditedData = joinrow;
    this.sendthewholwjoinList = this.addedJoinoperation;
    this.editClickedForJoin = true;
    this.openJoinComponent = true;
    this.openSplitComponent = false;
  }

  onClickDeleteJoin(joinrow: any) {
    this.editClickedForJoin = false;
    var filtered = this.addedJoinoperation.filter(function (value) {
      return value !== joinrow;
    });
    this.addedJoinoperation = filtered;
    if (this.addedJoinoperation.length === 0) {
      this.dataFlag = false;
    }
  }
}
