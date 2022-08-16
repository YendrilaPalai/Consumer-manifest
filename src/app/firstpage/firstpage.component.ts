import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})
export class FirstpageComponent implements OnInit {
  toppings = new FormControl('');
  toppingList: string[] = ['DataSource1', 'DataSource2', 'DataSource3', 'DataSource4', 'DataSource5', 'DataSource6'];

  constructor() { }

  ngOnInit(): void {
  }

}
