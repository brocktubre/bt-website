import { BrewService } from './brew.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { BrewStatsObj } from '../models/brew-stats-object.model';

@Component({
  selector: 'app-brew',
  templateUrl: './brew.component.html',
  styleUrls: ['./brew.component.css']
})
export class BrewComponent implements OnInit, AfterViewInit {
  public year: number;
  public statsAvailable: boolean;
  public loadingStats: boolean;
  public canvas: any;
  public ctx: any;
  public latestTemp: string;
  public latestGravity: number;
  public latestReading: Date;

  constructor(private brewService: BrewService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.loadingStats = true;
    this.statsAvailable = false;
    this.brewService.getBrewStats().subscribe((stats) => {
      if (stats.length > 0) {
        console.log('There are brew stats in the Google sheet.');
        this.statsAvailable = true;
        this.loadingStats = false;
        this.buildChart(stats);
        this.getMoreStats(stats);
      } else {
        console.log('No brew stats in the Google sheet.');
      }
      this.loadingStats = false;
    });

  }

  ngAfterViewInit() {
    // something
  }

  public getMoreStats(stats: Array<BrewStatsObj>) {
    this.latestGravity = stats[stats.length - 1].gravity;
    this.latestTemp = (stats[stats.length - 1].temperature).toString() + '° F';
    this.latestReading = stats[stats.length - 1].date;
  }

  public buildChart(stats: Array<BrewStatsObj>) {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'line',

      data: {
          labels: stats.map(function(stat) {
            return stat.date;
          }),
          datasets: [
            {
              label: 'Temperature',
              data: stats.map(function(stat) {
                return stat.temperature;
              }),
              fill: false,
              borderWidth: 5,
              pointBorderWidth: 2,
              pointBackgroundColor: 'rgba(134, 179, 218, 1)',
              borderColor: 'rgba(44, 98, 144, 1)',
              order: 1,
              yAxisID: 'temp'

          },
          {
            label: 'Gravity',
            data: stats.map(function(stat) {
              return stat.gravity;
            }),
            fill: false,
            borderWidth: 5,
            pointBorderWidth: 2,
            pointBackgroundColor: 'rgba(177, 224, 154, 1)',
            borderColor: 'rgba(67, 125, 38, 1)',
            order: 2,
            yAxisID: 'gravity'
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontSize: 18,
          }
        },
        scales: {
          yAxes: [{
            id: 'temp',
            type: 'linear',
            position: 'left',
            gridLines: {
              display: false
            },
            scaleLabel: {
              labelString: 'Temperature',
              fontSize: 24,
              display: true
            },
            ticks: {
              fontSize: 14
            }
          }, {
            id: 'gravity',
            type: 'linear',
            position: 'right',
            // gridLines: {
            //   display: false
            // },
            ticks: {
              max: 1.075,
              min: 0.999,
              stepSize: 0.001,
              fontSize: 14
            },
            scaleLabel: {
              labelString: 'Gravity',
              fontSize: 24,
              display: true
            },

          }],
          xAxes: [{
            scaleLabel: {
              labelString: 'Reading Date & Time',
              fontSize: 24,
              display: true
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 15,
              max: 80,
              min: 32,
              stepSize: 1,
              fontSize: 14
            }
          }],
      }
      }
    });
  }



}
