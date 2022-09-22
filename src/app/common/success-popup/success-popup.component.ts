import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css'],
})
export class SuccessPopupComponent implements OnInit {
  fileName: any;
  getListOfDomainsData: any;
  getListOfConsumersData: any;
  successPopUpForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _apiService: ApiService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.formIntitialization();
    this.getListOfConsumers();
    this.getListOfDomains();
  }

  formIntitialization() {
    this.successPopUpForm = new FormGroup({
      fileName: new FormControl('', [Validators.required]),
      targetConsumer: new FormControl('', [Validators.required]),
      targetDomain: new FormControl('', [Validators.required]),
    });
  }

  saveFileDetails() {
    let data = {
      fileName: this.successPopUpForm.get('fileName')?.value,
      targetConsumer: this.successPopUpForm.get('targetConsumer')?.value,
      targetDomain: this.successPopUpForm.get('targetDomain')?.value,
    };
    this.dialogRef.close(data);
  }
  getListOfDomains() {
    this._apiService.getListOfDomains().subscribe((response: any) => {
      this.getListOfDomainsData = response;
    });
  }
  getListOfConsumers() {
    this._apiService.getListOfConsumers().subscribe((response: any) => {
      this.getListOfConsumersData = response;
    });
  }
}
