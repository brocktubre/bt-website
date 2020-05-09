import { BrewService } from './brew.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brew',
  templateUrl: './brew.component.html',
  styleUrls: ['./brew.component.css']
})
export class BrewComponent implements OnInit {
  public year: number;
  public statsAvailable: boolean;
  public loadingStats: boolean;

  constructor(private brewService: BrewService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.loadingStats = true;
    this.statsAvailable = false;
    this.brewService.getBrewStats().subscribe((stats) => {
      if (stats.length > 0) {
        console.log('There are brew stats in the Google sheet.');
        this.statsAvailable = true;
      } else {
        console.log('No brew stats in the Google sheet.');
      }
      this.loadingStats = false;
    });
  }


}
