import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css']
})
export class SuccessPopupComponent implements OnInit {

  typeOfFormat:any;
  fileName:any;
  constructor(
    public dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  saveFileDetails(){
    console.log('filede',this.typeOfFormat,this.fileName)
    let data = {
      fileType: this.typeOfFormat,
      fileName: this.fileName
    };
    this.dialogRef.close(data);
  }

  onChangeTypeOfFile(event:any){
    this.typeOfFormat = event.target?.options[event.target.options.selectedIndex].text;
    console.log('eventval',this.typeOfFormat);
  }
}
