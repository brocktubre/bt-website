import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-previous-brews',
  templateUrl: './previous-brews.component.html',
  styleUrls: ['./previous-brews.component.css']
})
export class PreviousBrewsComponent implements OnInit {
  public year: number;

  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

}
