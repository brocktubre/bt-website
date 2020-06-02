import { Component, OnInit } from '@angular/core';
import { BrewStatsObj } from '../../models/brew-stats-object.model';
import { BrewService } from '../brew.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-previous-brews',
  templateUrl: './previous-brews.component.html',
  styleUrls: ['./previous-brews.component.css']
})
export class PreviousBrewsComponent implements OnInit {
  public year: number;
  public loadingBrews: boolean;
  public previousBrewsList: Array<BrewStatsObj>;

  constructor(private brewService: BrewService, private router: Router) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.loadingBrews = true;
    // getPreviousBrewsTable
    this.brewService.getPreviousBrewsTable().subscribe((brews) => {
      this.previousBrewsList = brews.reverse();
      this.loadingBrews = false;
    });
  }

  public navigateToBrewStats(id: number) {
    this.router.navigate(['/brew/' + id]);
  }

  public goToLink(url: string) {
    window.open(url, '_blank');
  }

}
