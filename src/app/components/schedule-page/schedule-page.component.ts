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
import { formatDate } from '@angular/common';
import { Constants } from 'src/app/constants/constants';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SchedulePageComponent implements OnInit {
  simpleTabClicked: boolean = true;
  manualTabClicked: boolean = false;
  value: any = 1;
  selectedStDate: string;
  const:any={};
  selectedEnDate: string;
  hourlyTabSelected: boolean = true;
  monthlyTabSelected: boolean = false;
  weeklyTabSelected: boolean = false;
  yearlyTabSelected: boolean = false;
  cronPieces: any;
  date: any;
  startDateMin: any;
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

  editedResponse: any = {};
  scheduleForm: FormGroup;
  publishAdvancedTabForm: FormGroup;
  selectedTab: any;
  cronReadable: string = 'Cron expressions as human readable text';
  tabIndex: any = '';
  selectedManifest: any;
  startDateFilled: boolean = false;
  endDateFilled: boolean = false;
  showTheForm: boolean = false;
  tabgroupdisable: boolean = true;
  advanceFormdisable: boolean = true;
  startDateValue: any;
  endDateValue: any;
  buttonName = 'Schedule';
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private _splitwindowService: SplitwindowService,
    private _apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.const["clearTooltip"]=Constants.clearSchedule;
    this.const["scheduleTooltip"]=Constants.scheduleData;
    this.const["cronTooltip"]=Constants.cronSchedule;
    this.const["cronTooltip1"]=Constants.cronExp1;
    this.const["cronTooltip2"]=Constants.cronExp2;
    this.const["cronTooltip3"]=Constants.cronExp3;
    this.const["cronTooltip4"]=Constants.cronExp4;
    this.const["validateTooltip"]=Constants.validate;
    this.formIntitialization();
    this.advancedTabFormIntitialization();
    this.buttonName = 'Schedule';
    this._splitwindowService
      .retrieveStoreSelectedPublishData()
      .subscribe((res: any) => {
        console.log('restored',res);
        this.editedResponse = res;
        this.selectedManifest = res.manifestName;
        this.selectedStDate = res.startDate;
        this.selectedEnDate = res.endDate;
        if (res.entitySk != 0) {
          this.buttonName = 'Update';
        }

        this.selectedStDate
          ? this.scheduleForm
              .get('startdate')
              ?.setValue(formatDate(this.selectedStDate, 'yyyy-MM-dd', 'en'))
          : '';
        this.selectedEnDate
          ? this.scheduleForm
              .get('enddate')
              ?.setValue(formatDate('2022-12-22', 'yyyy-MM-dd', 'en'))
          : '';

        this.onStartDateChange(
          formatDate(this.selectedStDate, 'yyyy-MM-dd', 'en')
        );
        this.onEndDateChange(
          formatDate(this.selectedEnDate, 'yyyy-MM-dd', 'en')
        );

        let cornexpression = res.cronExpr;
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
        const validValue = isValidExp.getValue();
        var newString = new String(validValue.daysOfWeek);

        //Daily 	*/5 * ? * *	    2 15 ? * 3	
        console.log(validValue,"validval",cornexpression, ":: ",cornexpression.toString().includes('-'))
        
        if (validValue.daysOfWeek === '?' && !(validValue.hours).toString().includes('-') && cornexpression.toString().includes('-')==false ) {
          this.manualTabClicked = false;
          this.simpleTabClicked = true;
          this.tabIndex = 1;
          this.onToggleGroupChange(this.tabIndex);
          this.convertCronToTimeDaily(validValue);
        }
        //Weekly 20 8 ? * 2L	
        else if (
          !newString.includes('#') &&!newString.includes('L') && 
          !newString.includes('C') &&
          validValue.daysOfMonth === '?' &&
          validValue.months === '*' &&
          !(validValue.minutes).toString().includes('/') 
          && cornexpression.toString().includes('-')==false
        ) {
          this.manualTabClicked = false;
          this.simpleTabClicked = true;
          this.tabIndex = 2;
          this.onToggleGroupChange(this.tabIndex);
          this.convertCronToTimeWeekly(validValue);
        }
        //Monthly
        else if (
          newString.includes('#') &&
          validValue.daysOfMonth === '?' &&
          validValue.months === '*'
          && cornexpression.toString().includes('-')==false
        ) {
          this.manualTabClicked = false;
          this.simpleTabClicked = true;
          this.tabIndex = 3;
          this.onToggleGroupChange(this.tabIndex);
          this.convertCronToTimeMonthly(validValue);
        }
        //yearly
        else if (validValue.months !== '*' && validValue.daysOfMonth === '?' && cornexpression.toString().includes('-')==false) {
          this.manualTabClicked = false;
          this.simpleTabClicked = true;
          this.tabIndex = 4;
          this.onToggleGroupChange(this.tabIndex);
          this.convertCronToTimeYearly(validValue);
        } 
      else {
          this.manualTabClicked = true;
          this.simpleTabClicked = false;
          this.publishAdvancedTabForm
            .get('cronExpression')
            ?.setValue(cornexpression);
        }
      });

    if (this.editedResponse.length == 0) {
      this._splitwindowService.sendthescheduleName.subscribe((res) => {
        if (res) {
          console.log('sub',this.editedResponse);
          let manifestDetails:any = localStorage.getItem('manifestDetails');
          this.selectedManifest = res.fileName ? res.fileName : manifestDetails.manifestName;
        }
      });
    }

    this.startDateMin = new Date();
  }

  clickOnSimple() {
    this.simpleTabClicked = true;
    this.manualTabClicked = false;
    this.formIntitialization();
    this.scheduleForm.get('startdate')?.setValue('');
    this.scheduleForm.get('enddate')?.setValue('');
    this.startDateFilled = false;
    this.endDateFilled = false;
    this.advanceFormdisable = true;
    this.onClear();
  }

  clickOnManual() {
    this.manualTabClicked = true;
    this.simpleTabClicked = false;
    this.advancedTabFormIntitialization();
    this.tabgroupdisable = true;
    this.showTheForm = false;
    this.scheduleForm.get('startdate')?.setValue('');
    this.scheduleForm.get('enddate')?.setValue('');
    this.startDateFilled = false;
    this.endDateFilled = false;
    this.tabIndex = -1;
    this.onClear();
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
    let targetCron:any;
    if (this.tabIndex == 3) {
      targetCron = this.convertTimeToCronMonthly(scheduledData);
    } else if (this.tabIndex == 4) {
      targetCron = this.convertTimeToCronYearly(scheduledData);
    } else if (this.tabIndex == 2) {
      targetCron = this.convertTimeToCronWeekly(scheduledData);
    } else if (this.tabIndex == 1) {
      targetCron = this.convertTimeToCronDaily(scheduledData);
    }
    let manifestDetails:any = localStorage.getItem('manifestDetails');
    manifestDetails.cronExpr = targetCron;
    manifestDetails.status = "Active";
    manifestDetails.startDate = scheduledData.selectedstartDate;
    manifestDetails.endDate = scheduledData.selectedEndDate;
    if(targetCron){
      this._apiService
    .publishManifest(manifestDetails)
    .subscribe((response: any) => {
      console.log('data', response);
      if (response) {
        this.successMessageInSnackbar("Manifest Status has been updated");
      }
    });
    }
    this.onClear();
  }
  successMessageInSnackbar(successmsg: any) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: successmsg,
      panelClass: ['custom-success'],
      duration: 1000000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'right', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
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
    if (isValidExp.isValid()) {
      let readable = cronstrue.toString(cornexpression);
      this.cronReadable = readable;
      const validValue = isValidExp.getValue();
    } else {
      let errorValue = isValidExp.getError();
      console.log(errorValue); // string[] of error messages
      this.errorMessageInSnackbar(errorValue[0]);
    }

    this.sendEditedData(cornexpression);
    this.onClear();
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
    // let yeartoset = '';
    // if (job.selectedstartDate) {
    //   const startDateArr = job.selectedstartDate.split('-');
    //   if (startDateArr[0]) {
    //     yeartoset = startDateArr[0];
    //   }
    //   this.cronPieces[6] = yeartoset;
    // }
    this.cronPieces.splice(0, 1);
    this.cronPieces = this.cronPieces.join(' ');

    this.sendEditedData(this.cronPieces);
    return this.cronPieces;
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
      } else if (job.selectedStartTime.amorpm === 'PM') {
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
    // let yeartoset = '';
    // let monthtoset = '';
    // if (job.selectedstartDate) {
    //   const startDateArr = job.selectedstartDate.split('-');
    //   if (startDateArr[0]) {
    //     yeartoset = startDateArr[0];
    //     monthtoset = startDateArr[1];
    //   }
    //   //this.cronPieces[6] = yeartoset;
    //   this.cronPieces[4] = monthtoset;
    // }
    this.cronPieces.splice(0, 1);
    this.cronPieces = this.cronPieces.join(' ');
    this._splitwindowService.storeSelectedCronData({
      crondataschedule: this.cronPieces,
      advancedTabClicked: this.manualTabClicked,
    });

    this.sendEditedData(this.cronPieces);
    return this.cronPieces;
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
    this.cronPieces.splice(0, 1);
    this.cronPieces = this.cronPieces.join(' ');
    this._splitwindowService.storeSelectedCronData({
      crondataschedule: this.cronPieces,
      advancedTabClicked: this.manualTabClicked,
    });

    //creating the entity for edit
    this.sendEditedData(this.cronPieces);
    return this.cronPieces;

    //return this.cronPieces.join(' ');
  }

  convertTimeToCronDaily(job: any) {
    // let freq = job.frequency.computer,
    // 0 16/2 ? * ? *  At 0 minutes past the hour, every 2 hours, starting at 04:00 PM

    //<seconds> <minutes> <hours> <day-of-month> <month> <day-of-week> <year>

    this.cronPieces = ['00', '*', '*', '?', '*', '?'];

    //MINUTE
    this.cronPieces[1] = job.selectedStartTime.minutes;

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
    this.cronPieces.splice(0, 1);
    this.cronPieces = this.cronPieces.join(' ');
    this._splitwindowService.storeSelectedCronData({
      crondataschedule: this.cronPieces,
      advancedTabClicked: this.manualTabClicked,
    });

    //creating the entity for edit
    this.sendEditedData(this.cronPieces);
    return this.cronPieces;

    //return this.cronPieces.join(' ');
  }

  convertCronToTimeDaily(job: any) {
    let jobstrttime = job.hours.split('/');
    let everyhour = Number(jobstrttime[1]);
    let strttimehr = Number(jobstrttime[0]);
    let strttimemin = Number(job.minutes);
    if (strttimehr > 12) {
      let final = strttimehr - 12;
      this.scheduleForm.get('numhourst')?.setValue(final);
      this.scheduleForm.get('amORpmst')?.setValue('PM');
    } else {
      this.scheduleForm.get('numhourst')?.setValue(strttimehr);
      this.scheduleForm.get('amORpmst')?.setValue('AM');
    }

    //let eh1= this.everyHour.find((eh:number)=>eh===everyhour);
    //   let evryhr1=[];
    // evryhr1.push(everyhour);
    this.scheduleForm.get('everyHour')?.setValue(everyhour);
    this.scheduleForm.get('numminutest')?.setValue(strttimemin);
  }

  convertCronToTimeWeekly(job: any) {
    this.daysOfWeek.forEach((week: any) => {
      if (Number(job.daysOfWeek) === week.id) {
        let onDay = week.name;
        this.scheduleForm.get('onday')?.setValue(onDay);
      }
    });
    let strttimemin = job.minutes;
    if (job.hours > 12) {
      let strttimehr = job.hours - 12;
      this.scheduleForm.get('numhourst')?.setValue(strttimehr);
      this.scheduleForm.get('amORpmst')?.setValue('PM');
    } else {
      let strttimehr = job.hours;
      this.scheduleForm.get('numhourst')?.setValue(strttimehr);
      this.scheduleForm.get('amORpmst')?.setValue('AM');
    }

    this.scheduleForm.get('numminutest')?.setValue(strttimemin);
  }

  convertCronToTimeMonthly(job: any) {
    let dayOfweek = job.daysOfWeek.split('#');
    let onDay = Number(dayOfweek[0]);
    let repeatOnThe = Number(dayOfweek[1]);
    let strttimehr = Number(job.hours);
    let strttimemin = Number(job.minutes);

    this.repeatOnWeek.forEach((data: any) => {
      if (repeatOnThe === data.id) {
        let repeatData = data.name;
        this.scheduleForm.get('repeatonthe')?.setValue(repeatData);
      }
    });

    this.daysOfWeek.forEach((week: any) => {
      if (onDay === week.id) {
        let onDayName = week.name;
        this.scheduleForm.get('onday')?.setValue(onDayName);
      }
    });

    if (strttimehr > 12) {
      let finalstrtimehr = strttimehr - 12;
      this.scheduleForm.get('numhourst')?.setValue(finalstrtimehr);
      this.scheduleForm.get('amORpmst')?.setValue('PM');
    } else {
      this.scheduleForm.get('numhourst')?.setValue(strttimehr);
      this.scheduleForm.get('amORpmst')?.setValue('AM');
    }

    this.scheduleForm.get('numminutest')?.setValue(strttimemin);
  }

  convertCronToTimeYearly(job: any) {
    let dayOfweek = job.daysOfWeek.split('#');
    let onDay = Number(dayOfweek[0]);
    let repeatOnThe = Number(dayOfweek[1]);
    let onMonth = Number(job.months);
    let strttimehr = Number(job.hours);
    let strttimemin = Number(job.minutes);

    this.repeatOnWeek.forEach((data: any) => {
      if (repeatOnThe === data.id) {
        let repeatData = data.name;
        this.scheduleForm.get('repeatonthe')?.setValue(repeatData);
      }
    });

    this.daysOfWeek.forEach((week: any) => {
      if (onDay === week.id) {
        let onDayName = week.name;
        this.scheduleForm.get('onday')?.setValue(onDayName);
      }
    });
    this.monthsOfYear.forEach((month: any) => {
      if (onMonth === month.id) {
        let onMonthName = month.name;
        this.scheduleForm.get('onmonth')?.setValue(onMonthName);
      }
    });

    if (strttimehr > 12) {
      let finalstrtimehr = strttimehr - 12;
      this.scheduleForm.get('numhouryr')?.setValue(finalstrtimehr);
      this.scheduleForm.get('amORpmyr')?.setValue('PM');
    } else {
      this.scheduleForm.get('numhouryr')?.setValue(strttimehr);
      this.scheduleForm.get('amORpmyr')?.setValue('AM');
    }
    this.scheduleForm.get('numminuteyr')?.setValue(strttimemin);
  }

  onStartDateChange(event: any) {
    this.scheduleForm.get('enddate')?.setValue('');
    this.startDateValue = this.scheduleForm.get('startdate')?.value;
    this.startDateMin = this.date ? this.date : event;
    this.endDateMin = event.target ? event.target.value : event;

    if (
      this.scheduleForm.get('startdate')?.value !== null ||
      this.scheduleForm.get('startdate')?.value !== ''
    ) {
      this.startDateFilled = true;
    }

    if (this.startDateFilled && this.endDateFilled) {
      this.tabgroupdisable = false;
      this.advanceFormdisable = false;
    } else {
      this.tabgroupdisable = true;
      this.advanceFormdisable = true;
    }
  }

  onEndDateChange(event: any) {
    this.selectedEnDate
      ? this.scheduleForm
          .get('enddate')
          ?.setValue(formatDate(this.selectedEnDate, 'yyyy-MM-dd', 'en'))
      : '';
    this.endDateValue = this.scheduleForm.get('enddate')?.value
      ? this.scheduleForm.get('enddate')?.value
      : event;
    if (
      this.scheduleForm.get('enddate')?.value !== null ||
      this.scheduleForm.get('enddate')?.value !== ''
    ) {
      this.endDateFilled = true;
    }
    if (this.startDateFilled && this.endDateFilled) {
      this.tabgroupdisable = false;
      this.advanceFormdisable = false;
    } else {
      this.tabgroupdisable = true;
      this.advanceFormdisable = true;
    }
  }

  onToggleGroupChange(event: any) {
    this.showTheForm = true;
    this.tabIndex = event.value ? event.value : event;
    this.formIntitialization();
    this.scheduleForm.get('startdate')?.setValue(this.startDateValue);
    this.scheduleForm.get('enddate')?.setValue(this.endDateValue);
    if (this.tabIndex == 1) {
      this.hourlyTabSelected = true;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = false;
      //this.scheduleForm.controls['everyHour']=12
    } else if (this.tabIndex == 2) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = true;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = false;
    } else if (this.tabIndex == 3) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = true;
      this.yearlyTabSelected = false;
    } else if (this.tabIndex == 4) {
      this.hourlyTabSelected = false;
      this.weeklyTabSelected = false;
      this.monthlyTabSelected = false;
      this.yearlyTabSelected = true;
    }
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

  onClear() {
    this.formIntitialization();
    this.advancedTabFormIntitialization();
    this.tabgroupdisable = true;
    this.advanceFormdisable = true;
    this.showTheForm = false;
    this.startDateFilled = false;
    this.endDateFilled = false;
    this.tabIndex = -1;
    this.buttonName = 'Schedule';
    this._splitwindowService.publishManifestData.next([]);
  }

  sendEditedData(cornexpression: any) {
    let editschedule: NewSchedule = {} as NewSchedule;
    if (this.editedResponse.editedFlag == true) {
      editschedule.cronExpr = cornexpression;
      editschedule.editedFlag = true;
      editschedule.editedIndex = this.editedResponse.editedIndex;
      editschedule.endDate = this.scheduleForm.get('enddate')?.value;
      editschedule.entityName = this.editedResponse.entityName;
      editschedule.flag = this.editedResponse.flag;
      editschedule.publish = '';
      editschedule.startDate = this.scheduleForm.get('startdate')?.value;
    } else {
      editschedule.cronExpr = cornexpression;
      editschedule.editedFlag = false;
      editschedule.editedIndex = '';
      editschedule.endDate = this.scheduleForm.get('enddate')?.value;
      editschedule.entityName = this.selectedManifest;
      editschedule.flag = true;
      editschedule.publish = '';
      editschedule.startDate = this.scheduleForm.get('startdate')?.value;
    }

    this._splitwindowService.storeSelectedCronData({
      crondataschedule: editschedule,
      advancedTabClicked: this.manualTabClicked,
    });
  }
}

interface NewSchedule {
  entityName: string;
  cronExpr: string;
  publish: string;
  flag: boolean;
  startDate: string;
  endDate: string;
  editedFlag: boolean;
  editedIndex: any;
}
