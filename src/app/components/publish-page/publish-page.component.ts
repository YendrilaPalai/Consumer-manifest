import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var require: any;
var publishData = require('src/assets/publish.json');

interface USERS {
  name: string;
  schedule: string;
  publish: string;
  status: boolean;
}

@Component({
  selector: 'app-publish-page',
  templateUrl: './publish-page.component.html',
  styleUrls: ['./publish-page.component.css'],
})
export class PublishPageComponent implements OnInit {
  operations: any = [
    { id: 3432, name: 'Show All' },
    { id: 3442, name: 'Show Published' },
    { id: 3352, name: 'Show Unpublished' },
  ];
  dropdown2 = '';
  tabDat: any = [];
  searchManifest: string = '';

  Users: USERS[] = publishData;
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(publishData);
  }

  onBackClick() {
    this.router.navigate(['/home-page']);
  }

  updateActiveStatus(element: any) {
    element.status = !element.status;
  }

  changeAction(event: any) {
    console.log(event.target.value);
    if (event.target.value === 'Show Unpublished') {
      this.Users = publishData;
      this.tabDat = this.Users.filter((x) => x.publish === 'Not available');
      this.Users = [];
      this.Users = this.tabDat;
    } else if (event.target.value === 'Show Published') {
      this.Users = publishData;
      this.tabDat = this.Users.filter((x) => x.status === true);
      this.Users = [];
      this.Users = this.tabDat;
    } else {
      this.Users = publishData;
    }
  }
}
