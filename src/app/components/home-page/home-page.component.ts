import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  fromEvent,
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  myForm: FormGroup;
  search: any;
  searchResult: any;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('filterInput', { static: true }) filterInput: ElementRef;

  
  sortLists: any = ['Name'];

  constructor(private route:Router,private _apiService: ApiService,) {}
  finalmanifests: any[] = [];

  manifests: any[] = [];

  ngOnInit(): void {
    this._apiService.getAllManifest().subscribe((response: any) => {
      this.manifests = response;
      this.finalmanifests = this.manifests;
    });
    this.myForm = new FormGroup({
      search: new FormControl(''),
      filter: new FormControl(''),
      sort: new FormControl(''),
    });

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 1
        filter((res) => res.length >= 0),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        console.log(text, 'text');
        this.searchResult = this.manifests.filter((filtered) =>
          filtered.consName.includes(text)
        );

        console.log(this.searchResult);
        this.finalmanifests = this.searchResult;
        // this.searchGetCall(text).subscribe((res) => {
        //   console.log('res', res);
        //   this.isSearching = false;
        //   this.apiResponse = res;
        // }, (err) => {
        //   this.isSearching = false;
        //   console.log('error', err);
        // });
      });


      fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 1
        filter((res) => res.length >= 0),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        console.log(text, 'text');
        this.searchResult = this.manifests.filter((filtered) =>
          filtered.consName.includes(text)
        );

        console.log(this.searchResult);
        this.finalmanifests = this.searchResult;
        // this.searchGetCall(text).subscribe((res) => {
        //   console.log('res', res);
        //   this.isSearching = false;
        //   this.apiResponse = res;
        // }, (err) => {
        //   this.isSearching = false;
        //   console.log('error', err);
        // });
      });
  }

  changeSort(e: any) {
    console.log(e, 'eeeeeeeeeeeeee');
    this.finalmanifests=[]
    if (e === "Name") {
      let searchResultBySort = this.manifests?.sort((a, b) =>
        a.consName.toLowerCase().localeCompare(b.consName.toLowerCase())
      );
      console.log(searchResultBySort);
      this.finalmanifests = searchResultBySort;
    }
    else{
        let searchResultBySort =this.manifests.sort((a, b) => {
            const newA = a.date.split('/').reverse().join('-');
            const newB = b.date.split('/').reverse().join('-');
            return +new Date(newA) - +new Date(newB)
          })
        console.log(searchResultBySort);
        this.finalmanifests = searchResultBySort;
    }
  }
  goToCreatePage(){
		this.route.navigate(['/createManifest']); // navigate to other page
	}

  goToPublishPage(){
    this.route.navigate(['/publish']);
  }
}
