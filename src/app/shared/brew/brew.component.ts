import { BrewService } from './brew.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brew',
  templateUrl: './brew.component.html',
  styleUrls: ['./brew.component.css']
})
export class BrewComponent implements OnInit {
  public year: number;
  public SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  constructor(private brewService: BrewService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.brewService.getBrewStats().subscribe((results) => {
      debugger;
    });
  }


}
