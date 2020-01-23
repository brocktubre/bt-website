import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cuhackit2020',
  templateUrl: './cuhackit2020.component.html',
  styleUrls: ['./cuhackit2020.component.css']
})
export class Cuhackit2020Component implements OnInit {
  public year: number;
  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

}
