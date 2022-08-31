import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Filter } from 'src/app/interface/filter-interface';
import {
  Domainn,
  Entity,
  EntityAttribute,
} from 'src/app/interface/split-interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  simpleTabClicked: boolean = true;
  manualTabClicked: boolean = false;
  myForm: FormGroup;
  advancedTabForm: FormGroup;
  operations: any = [];
  datasourceList: any[] = [];
  entityList: any[] = [];
  entityAttrList: any[] = [];
  showthePrevOperation: string = '';
  addClicked: boolean = false;
  onEditClicked: boolean = false;
  andOrData: string = '';
  enableAddButton: boolean = false;
  selectedOperator: string = 'AND';
  source: any;
  col: any;
  tab: any;
  button: any = 'Add';
  filterRowdata: any;
  listofdatatype: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _apiService: ApiService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data.prevoperation);
    this.formIntitialization();
    this.advancedTabFormIntitialization();
    this.myForm.controls['table'].disable();
    this.myForm.controls['column'].disable();
    this.data.sourcedata.forEach((domain: any) => {
      if (domain.displayDomainTargetPanel == true) {
        this.datasourceList.push(domain);
      }
      // this.entityList=domain.entities
    });
    if (this.data.addClicked == true) {
      this.button = 'Add';
      this.andOrData = 'AND';
      this.addClicked = this.data.addClicked;
      this.data.prevoperation.forEach((element: any) => {
        this.showthePrevOperation = this.showthePrevOperation + element;
      });
    }
    if (this.data.editClicked == true) {
      this.myForm.controls['table'].enable();
      this.myForm.controls['column'].enable();
      this.button = 'Update';
      this.editClicked();
    }
    this.getDataTypes();
  }

  getDataTypes(){
    this._apiService.getDataTypes().subscribe((response: any) => {
      console.log('data', response.listofdatatype);
      this.listofdatatype = response.listofdatatype;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clickOnSimple() {
    this.simpleTabClicked = true;
    this.manualTabClicked = false;
    this.formIntitialization();
  }

  clickOnManual() {
    this.manualTabClicked = true;
    this.simpleTabClicked = false;
    this.advancedTabFormIntitialization();
  }
  onchangedatasource($event: any) {
    let text = $event.target?.options[$event.target.options.selectedIndex].text
      ? $event.target.options[$event.target.options.selectedIndex].text
      : $event;
    this.entityList = [];
    this.data.sourcedata.forEach((domain: any) => {
      if (
        domain.displayDomainTargetPanel == true &&
        domain.domainName === text
      ) {
        domain.entities.forEach((element: any) => {
          if (element.displayEntityTargetPanel == true) {
            this.entityList.push(element);
            this.myForm.controls['table'].enable();
          }
        });
      }
      // this.entityList=domain.entities
    });
  }
  onchangetable($event: any) {
    let text = $event.target?.options[$event.target.options.selectedIndex].text
      ? $event.target.options[$event.target.options.selectedIndex].text
      : $event;
    this.entityAttrList = [];

    this.entityList.forEach((element: any) => {
      if (element.entityName === text) {
        element.entityAttributes.forEach((attr: any) => {
          if (attr.entityAttributeDisableFlag == true) {
            this.entityAttrList.push(attr);
            this.myForm.controls['column'].enable();
          }
        });
      }
    });
  }

  onChangeColumn($event: any) {
    let text = $event.target?.options[$event.target.options.selectedIndex].text
      ? $event.target.options[$event.target.options.selectedIndex].text
      : $event;
    console.log('textcol', text);
    this.operations = [];
    let filterAttr = this.entityAttrList.filter(
      (a: any) => a.attrName === text
    );
    this._apiService.getDataTypes().subscribe((response: any) => {
      console.log('data', response.listofdatatype);
      this.listofdatatype = response.listofdatatype;
      this.listofdatatype.forEach((eachDataType: any) => {
        if (eachDataType.type === filterAttr[0].dataType) {
          this.operations = eachDataType.operators;
        }
      });
    });
  }

  onClickAddButton() {
    let filterdata = {} as Filter;
    filterdata.datasource = {} as Domainn;
    filterdata.table = {} as Entity;
    filterdata.column = {} as EntityAttribute;
    filterdata.screen = this.simpleTabClicked ?  "basic" : "Advanced";
    if(this.simpleTabClicked){
    filterdata.datasource.domainName = this.myForm.get('datasource')?.value;
    filterdata.table.entityName = this.myForm.get('table')?.value;
    filterdata.column.attrName = this.myForm.get('column')?.value;
    filterdata.operator = this.myForm.get('operation')?.value;
    filterdata.condition = this.myForm.get('condition')?.value;
    filterdata.expression = this.selectedOperator;
    console.log(filterdata, 'newString');
    }
    else{
    filterdata.columnCalName = this.advancedTabForm.get('columnCalName')?.value;
    filterdata.columnFormula = this.advancedTabForm.get('columnFormula')?.value;
    }
    let data = {
      operation: filterdata,
    };
    this.dialogRef.close(data);
  }

  changeActiveTab(data: any) {
    this.selectedOperator = data;
    this.andOrData = data;
    console.log(data + ' ::DATA: ');
  }
  onClear() {
    this.formIntitialization();
    this.advancedTabFormIntitialization();
  }

  formIntitialization() {
    this.myForm = new FormGroup({
      datasource: new FormControl('', [Validators.required]),
      table: new FormControl('', [Validators.required]),
      column: new FormControl('', [Validators.required]),
      operation: new FormControl('', [Validators.required]),
      condition: new FormControl('0.5', [Validators.required]),
    });
  }

  advancedTabFormIntitialization(){
    this.advancedTabForm = new FormGroup({
      columnCalName: new FormControl('', [Validators.required]),
      columnFormula: new FormControl('', [Validators.required]),
    });
  }

  isFormValid():boolean {
    if(this.myForm.valid && this.simpleTabClicked){
      console.log('val1',this.myForm);
      return false;
    }
    if(this.advancedTabForm.valid && this.manualTabClicked){
      console.log('val2',this.advancedTabForm);
      return false;
    }
    console.log('val3');
    return true;
  }

  editClicked() {
    console.log(this.data.filterrow, 'editclicked');
    this.onEditClicked = this.data.editClicked;
    this.addClicked = this.data.editClicked;
    this.filterRowdata = this.data.filterrow;
    this.selectedOperator = this.filterRowdata.expression;
    if(this.filterRowdata.screen === "basic"){
      this.simpleTabClicked = true;
      this.manualTabClicked = false;
      this.myForm = new FormGroup({
        datasource: new FormControl(this.filterRowdata.datasource.domainName),
        table: new FormControl(this.filterRowdata.table.entityName),
        column: new FormControl(this.filterRowdata.column.attrName),
        operation: new FormControl(this.filterRowdata.operator),
        condition: new FormControl(this.filterRowdata.condition),
      });
      this.onchangedatasource(this.filterRowdata.datasource.domainName);
      this.onchangetable(this.filterRowdata.table.entityName);
      this.onChangeColumn(this.filterRowdata.column.attrName);
    }else{
      this.simpleTabClicked = false;
      this.manualTabClicked = true;
      this.advancedTabForm = new FormGroup({
        columnCalName: new FormControl(this.filterRowdata.columnCalName),
        columnFormula: new FormControl(this.filterRowdata.columnFormula)
      });
    }
  }
}
