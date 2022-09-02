import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Publish,
  ScheduledData,
  TimeStamp,
} from 'src/app/interface/publish-interface';
import cronstrue from 'cronstrue';
import cron from 'cron-validate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/common/snackbar/snackbar.component';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent implements OnInit {
  simpleTabClicked: boolean = true;
  manualTabClicked: boolean = false;

  hourlyTabSelected: boolean = true;
  monthlyTabSelected: boolean = false;
  weeklyTabSelected: boolean = false;
  yearlyTabSelected: boolean = false;

  tabmap = [
    { id: 1, tabname: 'Hourly' },
    { id: 2, tabname: 'Weekly' },
    { id: 3, tabname: 'Monthly' },
    { id: 4, tabname: 'Yearly' },
  ];

  selectADay = [
    { id: 1, dayname: 'Monday' },
    { id: 2, dayname: 'Tuesday' },
    { id: 3, dayname: 'Wednesday' },
    { id: 4, dayname: 'Thrusday' },
    { id: 5, dayname: 'Friday' },
    { id: 6, dayname: 'Saturday' },
    { id: 7, dayname: 'Sunday' },
  ];
  repeatEvery = [1, 2, 3, 4];
  repeatOnTheList = ['First', 'Second', 'Third', 'Fourth'];
  onMonthList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  scheduleForm: FormGroup;
  publishAdvancedTabForm: FormGroup;
  selectedTab: any;
  cronReadable: string = 'Cron Expression';

  constructor(private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.formIntitialization();
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

  onClickOnPublish() {
    let publishData: Publish = {} as Publish;
    let scheduledData: ScheduledData = {} as ScheduledData;
    scheduledData.selectedStartTime = {} as TimeStamp;
    scheduledData.selectedTime = {} as TimeStamp;
    scheduledData.selectedEndTime = {} as TimeStamp;

    scheduledData.selectedstartDate = this.scheduleForm.get('startdate')?.value;

    scheduledData.selectedStartTime.hours =
      this.scheduleForm.get('numhourst')?.value;
    scheduledData.selectedStartTime.minutes =
      this.scheduleForm.get('numminutest')?.value;
    scheduledData.selectedStartTime.amorpm =
      this.scheduleForm.get('amORpmst')?.value;

    scheduledData.repeatEvery = this.scheduleForm.get('repeatevery')?.value;
    scheduledData.selectedDay = this.scheduleForm.get('selectedday')?.value;
    scheduledData.repeatOnThe = this.scheduleForm.get('repeatonthe')?.value;
    scheduledData.onDay = this.scheduleForm.get('onday')?.value;
    scheduledData.repeatInaMonth = this.scheduleForm.get('onmonth')?.value;

    scheduledData.selectedTime.hours =
      this.scheduleForm.get('numhouryr')?.value;
    scheduledData.selectedTime.minutes =
      this.scheduleForm.get('numminuteyr')?.value;
    scheduledData.selectedTime.amorpm =
      this.scheduleForm.get('amORpmyr')?.value;

    scheduledData.selectedEndDate = this.scheduleForm.get('enddate')?.value;
    scheduledData.selectedEndTime.hours =
      this.scheduleForm.get('numhouret')?.value;
    scheduledData.selectedEndTime.minutes =
      this.scheduleForm.get('numminuteet')?.value;
    scheduledData.selectedEndTime.amorpm =
      this.scheduleForm.get('amORpmet')?.value;

    console.log(scheduledData, 'scheduledData');
  }
  onBackClick() {
    this.router.navigate(['/createManifest']);
  }

  changeActiveTab(tabnumber: any) {
    this.formIntitialization();
    if (tabnumber.id == 1) {
      this.hourlyTabSelected = true;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = false;
    } else if (tabnumber.id == 2) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = true;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = false;
    } else if (tabnumber.id == 3) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = true;
      this.yearlyTabSelected = false;
    } else if (tabnumber.id == 4) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = true;
    }
  }

  formIntitialization() {
    this.scheduleForm = new FormGroup({
      startdate: new FormControl(),
      numhourst: new FormControl(),
      numminutest: new FormControl(),
      amORpmst: new FormControl(),
      repeatevery: new FormControl(),
      selectedday: new FormControl(),
      repeatonthe: new FormControl(),
      onday: new FormControl(),
      onmonth: new FormControl(),
      numhouryr: new FormControl(),
      numminuteyr: new FormControl(),
      amORpmyr: new FormControl(),
      enddate: new FormControl(),
      numhouret: new FormControl(),
      numminuteet: new FormControl(),
      amORpmet: new FormControl(),
    });
  }

  isFormValid(): boolean {
    // if (this.myForm.valid && this.simpleTabClicked) {
    //   console.log('val1', this.myForm);
    //   return false;
    // }
    if (this.publishAdvancedTabForm.valid && this.manualTabClicked) {
      return false;
    }
    return true;
  }

  advancedTabFormIntitialization() {
    this.publishAdvancedTabForm = new FormGroup({
      cronExpression: new FormControl('', [Validators.required]),
    });
  }

  onClickValidate() {
    let cornexpression =
      this.publishAdvancedTabForm.get('cronExpression')?.value;
    let isValidExp = cron(cornexpression, {
      preset: 'default',
      override: {
        useYears: true,
        useBlankDay: true,
        useAliases: true,
        useNthWeekdayOfMonth: true,
        useLastDayOfMonth: true, // optional, default to false
        useLastDayOfWeek: true, // optional, default to fals
        useNearestWeekday: true, // optional, default to false
      },
    });
    console.log('newhf',isValidExp,cornexpression);
    if (isValidExp.isValid()) {
      let readable = cronstrue.toString(cornexpression);
      this.cronReadable = readable;
      const validValue = isValidExp.getValue()
      console.log('check now', cornexpression, readable,validValue);
    }else {
      let errorValue = isValidExp.getError();
      // The error value contains an array of strings, which represent the cron validation errors.
      console.log(errorValue) // string[] of error messages
      this.errorMessageInSnackbar(errorValue[0]);
      //this.toastrService.error(errorValue[0], 'Error!');
    }
  }

  errorMessageInSnackbar(errormsg:any){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: errormsg,
      panelClass: ["custom-style"],
      duration: 10000000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "right" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
