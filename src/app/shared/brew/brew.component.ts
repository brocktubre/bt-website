import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brew',
  templateUrl: './brew.component.html',
  styleUrls: ['./brew.component.css']
})
export class BrewComponent implements OnInit {
  public year: number;
  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

}
