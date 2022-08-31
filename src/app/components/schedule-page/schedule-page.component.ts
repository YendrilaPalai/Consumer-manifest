import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent implements OnInit {
  simpleTabClicked: boolean = true;
  manualTabClicked: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  clickOnSimple() {
    this.simpleTabClicked = true;
    this.manualTabClicked = false;
    //this.formIntitialization();
  }

  clickOnManual() {
    this.manualTabClicked = true;
    this.simpleTabClicked = false;
    //this.advancedTabFormIntitialization();
  }

  onBackClick() {
    this.router.navigate(['/createManifest']);
  }
}
