import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  operations: any = ['>', '<', '==', '!=', '>=', '<='];
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

  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _apiService: ApiService,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.formIntitialization();
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
    // this._apiService.getDataTypes().subscribe((response: any) => {
    //   console.log('data', response.listofdatatype);
    //   this.listofdatatype = response.listofdatatype;
    // });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clickOnSimple() {
    this.simpleTabClicked = true;
    this.manualTabClicked = false;
  }

  clickOnManual() {
    this.manualTabClicked = true;
    this.simpleTabClicked = false;
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

  onClickAddButton() {
    let datasource = this.myForm.get('datasource')?.value;
    let table = this.myForm.get('table')?.value;
    let column = this.myForm.get('column')?.value;
    let operation = this.myForm.get('operation')?.value;
    let minmax = this.myForm.get('minmax')?.value;
    let sendTheString: string =
      datasource + ',' + table + ',' + column + ',' + operation + ',' + minmax;
    let newString: string = this.andOrData + ',' + sendTheString;

    console.log(newString, 'newString', sendTheString);
    let data = {
      operation: newString,
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
  }

  formIntitialization() {
    this.myForm = new FormGroup({
      datasource: new FormControl('', [Validators.required]),
      table: new FormControl('', [Validators.required]),
      column: new FormControl('', [Validators.required]),
      operation: new FormControl('', [Validators.required]),
      minmax: new FormControl('0.5', [Validators.required]),
    });
  }

  editClicked() {
    console.log(this.data.filterrow, 'editclicked');
    this.onEditClicked = this.data.editClicked;
    this.addClicked = this.data.editClicked;
    this.filterRowdata = this.data.filterrow;
    const prevdata = this.filterRowdata.split(',');
    const firstElement = prevdata.shift();
    console.log(firstElement,prevdata,'editclicked'); 
    this.selectedOperator = firstElement
    this.myForm = new FormGroup({
      datasource: new FormControl(prevdata[0]),
      table: new FormControl(prevdata[1]),
      column: new FormControl(prevdata[2]),
      operation: new FormControl(prevdata[3]),
      minmax: new FormControl(prevdata[4]),
    });
    console.log(this.myForm,prevdata, 'formclicked');
    this.onchangedatasource(prevdata[0]);
    this.onchangetable(prevdata[1]);
  }
}
