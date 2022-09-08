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
import { SplitwindowService } from 'src/app/services/splitwindow.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent implements OnInit {
  simpleTabClicked: boolean = true;
  manualTabClicked: boolean = false;
  value: any = 1;

  hourlyTabSelected: boolean = true;
  monthlyTabSelected: boolean = false;
  weeklyTabSelected: boolean = false;
  yearlyTabSelected: boolean = false;
  cronPieces: any;
  date: any;
  endDateMin: any;

  monthsOfYear = [
    { name: 'January', id: 1 },
    { name: 'February', id: 2 },
    { name: 'March', id: 3 },
    { name: 'April', id: 4 },
    { name: 'May', id: 5 },
    { name: 'June', id: 6 },
    { name: 'July', id: 7 },
    { name: 'August', id: 8 },
    { name: 'September', id: 9 },
    { name: 'October', id: 10 },
    { name: 'November', id: 11 },
    { name: 'December', id: 12 },
  ];

  repeatOnWeek = [
    { name: 'First', id: 1 },
    { name: 'Second', id: 2 },
    { name: 'Third', id: 3 },
    { name: 'Fourth', id: 4 },
  ];

  daysOfWeek = [
    { name: 'Sunday', id: 0 },
    { name: 'Monday', id: 1 },
    { name: 'Tuesday', id: 2 },
    { name: 'Wednesday', id: 3 },
    { name: 'Thrusday', id: 4 },
    { name: 'Friday', id: 5 },
    { name: 'Saturday', id: 6 },
  ];

  tabmap = [
    { id: 1, tabname: 'Daily' },
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
  everyHour = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];
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
  cronReadable: string = 'Cron expressions as human readable text';
  tabIndex: any = 1;
  selectedManifest:any;
  constructor(private router: Router, private snackBar: MatSnackBar,private _splitwindowService: SplitwindowService) {}

  ngOnInit(): void {
    this.formIntitialization();
    
    this._splitwindowService
    .retrieveStoreSelectedPublishData()
    .subscribe((res: any) => {
//console.log('schedule comp',res);
this.selectedManifest=res.entityName;
    });

    this.date = new Date();
    if (this.tabIndex == 1) {
      this.onToggleGroupChange(this.tabIndex);
      
    this.scheduleForm.controls['everyHour'].setValidators(
      Validators.required
    );
    this.scheduleForm.controls['numminutest'].setValidators(
      Validators.required
    );
    this.scheduleForm.controls['amORpmst'].setValidators(Validators.required);
    this.scheduleForm.controls['numhourst'].setValidators(
      Validators.required
    );
    }
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
    //scheduledData.selectedEndTime = {} as TimeStamp;
    publishData.schedulePlanner = this.tabIndex;
    publishData.schedulePlanner = scheduledData.selectedstartDate =
      this.scheduleForm.get('startdate')?.value;

    scheduledData.selectedStartTime.hours =
      this.scheduleForm.get('numhourst')?.value;
    scheduledData.selectedStartTime.minutes =
      this.scheduleForm.get('numminutest')?.value;
    scheduledData.selectedStartTime.amorpm =
      this.scheduleForm.get('amORpmst')?.value;

    scheduledData.repeatEvery = this.scheduleForm.get('repeatevery')?.value;
    scheduledData.everyHour = this.scheduleForm.get('everyHour')?.value;
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
    // scheduledData.selectedEndTime.hours =
    //   this.scheduleForm.get('numhouret')?.value;
    // scheduledData.selectedEndTime.minutes =
    //   this.scheduleForm.get('numminuteet')?.value;
    // scheduledData.selectedEndTime.amorpm =
    //   this.scheduleForm.get('amORpmet')?.value;

    console.log(scheduledData, 'scheduledData');

    if (this.tabIndex == 3) {
      this.convertTimeToCronMonthly(scheduledData);
    } else if (this.tabIndex == 4) {
      this.convertTimeToCronYearly(scheduledData);
    } else if (this.tabIndex == 2) {
      console.log('2');
      this.convertTimeToCronWeekly(scheduledData);
    } else if (this.tabIndex == 1) {
      console.log('1');
      this.convertTimeToCronDaily(scheduledData);
    }
  }
  onBackClick() {
    this.router.navigate(['/publish']);
  }

  formIntitialization() {
    this.scheduleForm = new FormGroup({
      startdate: new FormControl(),
      numhourst: new FormControl(),
      numminutest: new FormControl(),
      amORpmst: new FormControl(''),
      repeatevery: new FormControl(),
      everyHour: new FormControl(''),
      repeatonthe: new FormControl(''),
      onday: new FormControl(''),
      onmonth: new FormControl(''),
      numhouryr: new FormControl(),
      numminuteyr: new FormControl(),
      amORpmyr: new FormControl(''),
      enddate: new FormControl(),
      numhouret: new FormControl(),
      numminuteet: new FormControl(),
      amORpmet: new FormControl(),
    });
    this.hourlyTabSelected = true;
    this.weeklyTabSelected = false;
    this.monthlyTabSelected = false;
    this.yearlyTabSelected = false;
    this.cronReadable = 'Cron expressions as human readable text';

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
        useYears: false,
        useBlankDay: true,
        useAliases: true,
        useNthWeekdayOfMonth: true,
        useLastDayOfMonth: true, // optional, default to false
        useLastDayOfWeek: true, // optional, default to fals
        useNearestWeekday: true, // optional, default to false
      },
    });
    console.log('newhf', isValidExp, cornexpression);
    if (isValidExp.isValid()) {
      let readable = cronstrue.toString(cornexpression);
      this.cronReadable = readable;
      const validValue = isValidExp.getValue();
      console.log('check now', cornexpression, readable, validValue);
    } else {
      let errorValue = isValidExp.getError();
      // The error value contains an array of strings, which represent the cron validation errors.
      console.log(errorValue); // string[] of error messages
      this.errorMessageInSnackbar(errorValue[0]);
      //this.toastrService.error(errorValue[0], 'Error!');
    }
  }

  errorMessageInSnackbar(errormsg: any) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: errormsg,
      panelClass: ['custom-style'],
      duration: 10000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'right', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  convertTimeToCronYearly(job: any) {
    // let freq = job.frequency.computer,
    // 0 10 ? * 2#3  At 10 a.m. on the third Monday of every month:

    //<seconds> <minutes> <hours> <day-of-month> <month> <day-of-week> <year>

    this.cronPieces = ['00', '*', '*', '?', '*', '?'];

    //MINUTE
    this.cronPieces[1] = job.selectedTime.minutes
      ? job.selectedTime.minutes
      : '*';

    //HOUR
    if (job.selectedTime.amorpm === 'AM') {
      if (job.hour === 12) {
        this.cronPieces[2] = '0';
      } else {
        this.cronPieces[2] = job.selectedTime.hours;
      }
    } else if (job.selectedTime.hours === 12) {
      this.cronPieces[2] = '12';
    } else {
      this.cronPieces[2] = job.selectedTime.hours + 12;
    }

    //MONTH
    if (job.repeatInaMonth) {
      this.monthsOfYear.forEach((mon: any) => {
        if (job.repeatInaMonth === mon.name) {
          this.cronPieces[4] = mon.id;
        }
      });
    }

    //Day of week
    let repeatData = '';
    let repeatWeek = '';
    if (job.repeatOnThe) {
      this.repeatOnWeek.forEach((data: any) => {
        if (job.repeatOnThe === data.name) {
          repeatData = data.id;
        }
      });
    }
    if (job.onDay) {
      this.daysOfWeek.forEach((week: any) => {
        if (job.onDay === week.name) {
          repeatWeek = week.id;
        }
      });
    }
    this.cronPieces[5] = repeatWeek + '#' + repeatData;

    //YEAR
    let yeartoset = '';
    if (job.selectedstartDate) {
      const startDateArr = job.selectedstartDate.split('-');
      if (startDateArr[0]) {
        yeartoset = startDateArr[0];
      }
      this.cronPieces[6] = yeartoset;
    }
    this.cronPieces.splice(0,1)
    this.cronPieces = this.cronPieces.join(' ');
    console.log(this.cronPieces, 'cron');

    //return this.cronPieces.join(' ');
  }

  convertTimeToCronMonthly(job: any) {
    // let freq = job.frequency.computer,
    // 0 10 ? * 2#3  At 10 a.m. on the third Monday of every month:

    //<seconds> <minutes> <hours> <day-of-month> <month> <day-of-week> <year>

    this.cronPieces = ['00', '*', '*', '?', '*', '?'];

    //MINUTE
    this.cronPieces[1] = job.selectedStartTime.minutes
      ? job.selectedStartTime.minutes
      : '*';

    //HOUR
    let hourstart = '';
    let hourend = '';
    if (job.selectedStartTime) {
      if (job.selectedStartTime.amorpm === 'AM') {
        if (job.hour === 12) {
          hourstart = '0';
        } else {
          hourstart = job.selectedStartTime.hours;
        }
      } else if (job.selectedStartTime.hours === 12) {
        hourstart = '12';
      } else {
        hourstart = job.selectedStartTime.hours + 12;
      }
    }

    this.cronPieces[2] = hourstart;

    //MONTH
    // if (job.repeatInaMonth) {
    //   this.monthsOfYear.forEach((mon: any) => {
    //     if (job.repeatInaMonth === mon.name) {

    //     }
    //   });
    // }

    //Day of week
    let repeatData = '';
    let repeatWeek = '';
    if (job.repeatOnThe) {
      this.repeatOnWeek.forEach((data: any) => {
        if (job.repeatOnThe === data.name) {
          repeatData = data.id;
        }
      });
    }
    if (job.onDay) {
      this.daysOfWeek.forEach((week: any) => {
        if (job.onDay === week.name) {
          repeatWeek = week.id;
        }
      });
    }
    this.cronPieces[5] = repeatWeek + '#' + repeatData;

    //YEAR
    let yeartoset = '';
    let monthtoset = '';
    if (job.selectedstartDate) {
      const startDateArr = job.selectedstartDate.split('-');
      if (startDateArr[0]) {
        yeartoset = startDateArr[0];
        monthtoset = startDateArr[1];
      }
      this.cronPieces[6] = yeartoset;
      this.cronPieces[4] = monthtoset;
    }
    this.cronPieces.splice(0,1)
    this.cronPieces = this.cronPieces.join(' ');
    console.log(this.cronPieces, 'cron');

    //return this.cronPieces.join(' ');
  }

  convertTimeToCronWeekly(job: any) {
    // let freq = job.frequency.computer,
    // 4 15 ? * 1 *  At 03:04 PM, only on Monday

    //<seconds> <minutes> <hours> <day-of-month> <month> <day-of-week> <year>

    this.cronPieces = ['00', '*', '*', '?', '*', '?'];

    //MINUTE
    this.cronPieces[1] = job.selectedStartTime.minutes
      ? job.selectedStartTime.minutes
      : '*';

    //HOUR
    let hourstart = '';
    let hourend = '';
    if (job.selectedStartTime) {
      if (job.selectedStartTime.amorpm === 'AM') {
        if (job.hour === 12) {
          hourstart = '0';
        } else {
          hourstart = job.selectedStartTime.hours;
        }
      } else if (job.selectedStartTime.hours === 12) {
        hourstart = '12';
      } else {
        hourstart = job.selectedStartTime.hours + 12;
      }
    }

    this.cronPieces[2] = hourstart;

    //MONTH
    // if (job.repeatInaMonth) {
    //   this.monthsOfYear.forEach((mon: any) => {
    //     if (job.repeatInaMonth === mon.name) {

    //     }
    //   });
    // }

    //Day of week
    //let repeatData = '';
    let repeatWeek = '';
    // if (job.repeatOnThe) {
    //   this.repeatOnWeek.forEach((data: any) => {
    //     if (job.repeatOnThe === data.name) {
    //       repeatData = data.id;
    //     }
    //   });
    // }
    if (job.onDay) {
      this.daysOfWeek.forEach((week: any) => {
        if (job.onDay === week.name) {
          repeatWeek = week.id;
        }
      });
    }
    this.cronPieces[5] = repeatWeek;
    //this.cronPieces[5] = repeatWeek + '#' + repeatData;

    //YEAR
    // let yeartoset = '';
    // let monthtoset = '';
    // if (job.selectedstartDate) {
    //   const startDateArr = job.selectedstartDate.split('-');
    //   if (startDateArr[0]) {
    //     yeartoset = startDateArr[0];
    //     monthtoset = startDateArr[1];
    //   }
    //   this.cronPieces[6] = yeartoset;
    //   this.cronPieces[4] = monthtoset;
    // }
    this.cronPieces.splice(0,1)
    this.cronPieces = this.cronPieces.join(' ');
    console.log(this.cronPieces, 'cron');

    //return this.cronPieces.join(' ');
  }

  convertTimeToCronDaily(job: any) {
    // let freq = job.frequency.computer,
    // 0 16/2 ? * ? *  At 0 minutes past the hour, every 2 hours, starting at 04:00 PM

    //<seconds> <minutes> <hours> <day-of-month> <month> <day-of-week> <year>

    this.cronPieces = ['00', '*', '*', '?', '*', '?'];

    //MINUTE
    this.cronPieces[1] = 0;

    //HOUR
    let hourstart = '';
    let hourend = '';
    if (job.selectedStartTime) {
      if (job.selectedStartTime.amorpm === 'AM') {
        if (job.hour === 12) {
          hourstart = '0';
        } else {
          hourstart = job.selectedStartTime.hours;
        }
      } else if (job.selectedStartTime.hours === 12) {
        hourstart = '12';
      } else {
        hourstart = job.selectedStartTime.hours + 12;
      }
    }
    //0 0 */2 * * *
    this.cronPieces[2] = hourstart + '/' + job.everyHour;

    //MONTH
    // if (job.repeatInaMonth) {
    //   this.monthsOfYear.forEach((mon: any) => {
    //     if (job.repeatInaMonth === mon.name) {

    //     }
    //   });
    // }

    //Day of week
    // let repeatData = '';
    // let repeatWeek = '';
    // if (job.repeatOnThe) {
    //   this.repeatOnWeek.forEach((data: any) => {
    //     if (job.repeatOnThe === data.name) {
    //       repeatData = data.id;
    //     }
    //   });
    // }
    // if (job.onDay) {
    //   this.daysOfWeek.forEach((week: any) => {
    //     if (job.onDay === week.name) {
    //       repeatWeek = week.id;
    //     }
    //   });
    // }
    // this.cronPieces[5] = repeatWeek;
    //this.cronPieces[5] = repeatWeek + '#' + repeatData;

    //YEAR
    //let yeartoset = '';
    // let monthtoset = '';
    // if (job.selectedstartDate) {
    //   const startDateArr = job.selectedstartDate.split('-');
    //   if (startDateArr[0]) {
    //     yeartoset = startDateArr[0];
    //     monthtoset = startDateArr[1];
    //   }
    //   this.cronPieces[6] = yeartoset;
    //   this.cronPieces[4] = monthtoset;
    // }
    this.cronPieces.splice(0,1)
    this.cronPieces = this.cronPieces.join(' ');
    console.log(this.cronPieces, 'cron');

    //return this.cronPieces.join(' ');
  }

  onStartDateChange(event: any) {
    console.log('e', event.target.value);
    this.endDateMin = event.target.value;
    this.scheduleForm.get('enddate')?.setValue('');
  }

  onToggleGroupChange(event: any) {
    this.tabIndex = event.value ? event.value : event;
    console.log('tab', this.tabIndex);
    this.formIntitialization();
    if (event.value == 1) {
      this.hourlyTabSelected = true;

      this.weeklyTabSelected = false;

      this.monthlyTabSelected = false;

      this.yearlyTabSelected = false;

      this.scheduleForm.controls['everyHour'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['numminutest'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['amORpmst'].setValidators(Validators.required);

      this.scheduleForm.controls['numhourst'].setValidators(
        Validators.required
      );
      this.scheduleForm.controls['repeatonthe'].updateValueAndValidity();

      this.scheduleForm.controls['repeatonthe'].clearValidators();

      this.scheduleForm.controls['onday'].updateValueAndValidity();

      this.scheduleForm.controls['onday'].clearValidators();

      this.scheduleForm.controls['onmonth'].updateValueAndValidity();

      this.scheduleForm.controls['onmonth'].clearValidators();

      this.scheduleForm.controls['numminuteyr'].updateValueAndValidity();

      this.scheduleForm.controls['numminuteyr'].clearValidators();

      this.scheduleForm.controls['amORpmyr'].updateValueAndValidity();

      this.scheduleForm.controls['amORpmyr'].clearValidators();

      this.scheduleForm.controls['numhouryr'].updateValueAndValidity();

      this.scheduleForm.controls['numhouryr'].clearValidators();
    } else if (event.value == 2) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = true;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = false;

      this.scheduleForm.controls['onday'].setValidators(Validators.required);

      this.scheduleForm.controls['numminutest'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['amORpmst'].setValidators(Validators.required);

      this.scheduleForm.controls['numhourst'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['selectedday'].updateValueAndValidity();

      this.scheduleForm.controls['selectedday'].clearValidators();

      this.scheduleForm.controls['repeatonthe'].updateValueAndValidity();

      this.scheduleForm.controls['repeatonthe'].clearValidators();

      this.scheduleForm.controls['onmonth'].updateValueAndValidity();

      this.scheduleForm.controls['onmonth'].clearValidators();

      this.scheduleForm.controls['numminuteyr'].updateValueAndValidity();

      this.scheduleForm.controls['numminuteyr'].clearValidators();

      this.scheduleForm.controls['amORpmyr'].updateValueAndValidity();

      this.scheduleForm.controls['amORpmyr'].clearValidators();

      this.scheduleForm.controls['numhouryr'].updateValueAndValidity();

      this.scheduleForm.controls['numhouryr'].clearValidators();
    } else if (event.value == 3) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = true;
      this.yearlyTabSelected = false;

      this.scheduleForm.controls['repeatonthe'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['onday'].setValidators(Validators.required);

      this.scheduleForm.controls['numminutest'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['amORpmst'].setValidators(Validators.required);

      this.scheduleForm.controls['numhourst'].setValidators(
        Validators.required
      );

      this.scheduleForm.controls['onmonth'].updateValueAndValidity();

      this.scheduleForm.controls['onmonth'].clearValidators();
      this.scheduleForm.controls['selectedday'].updateValueAndValidity();
      this.scheduleForm.controls['selectedday'].clearValidators();
      this.scheduleForm.controls['numminuteyr'].updateValueAndValidity();
      this.scheduleForm.controls['numminuteyr'].clearValidators();
      this.scheduleForm.controls['amORpmyr'].updateValueAndValidity();
      this.scheduleForm.controls['amORpmyr'].clearValidators();
      this.scheduleForm.controls['numhouryr'].updateValueAndValidity();
      this.scheduleForm.controls['numhouryr'].clearValidators();
    } else if (event.value == 4) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = true;

      this.scheduleForm.controls['repeatonthe'].setValidators(
        Validators.required
      );
      this.scheduleForm.controls['onday'].setValidators(Validators.required);
      this.scheduleForm.controls['onmonth'].setValidators(Validators.required);
      this.scheduleForm.controls['numminuteyr'].setValidators(
        Validators.required
      );
      this.scheduleForm.controls['amORpmyr'].setValidators(Validators.required);
      this.scheduleForm.controls['numhouryr'].setValidators(
        Validators.required
      );
      this.scheduleForm.controls['selectedday'].updateValueAndValidity();
      this.scheduleForm.controls['selectedday'].clearValidators();
    }
  }
}
