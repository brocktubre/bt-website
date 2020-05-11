import { BrewService } from './brew.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { BrewStatsObj } from '../models/brew-stats-object.model';
import * as moment from 'moment';
import { UiSwitchModule } from 'ngx-toggle-switch';

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
  public originalGravity: number;
  public currABV: string;
  public day: any;
  public brewName: string;
  public brewDate: string;
  public units: boolean;
  public stats_G: Array<BrewStatsObj>;
  public lineChart: any;
  public enoughData: boolean;
  public num_of_results_to_show = 20;

  constructor(private brewService: BrewService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.loadingStats = true;
    this.statsAvailable = false;
    this.enoughData = false;
    this.filterReadings(this.num_of_results_to_show);
  }

  ngAfterViewInit() {
    // something
  }

  public filterReadings(num: number) {
    this.num_of_results_to_show = num;
    this.brewService.getBrewStats().subscribe((stats) => {
      // Are there any results?
      if (stats.length > 0) {
        this.stats_G = stats;
        this.units = true;
        this.statsAvailable = true;
        this.loadingStats = false;

        const num_of_readings = this.stats_G.length;
        console.log('There are brew stats in the Google sheet. Number of readings: ' + num_of_readings);

        // Not enough data collected. Show alert warning.
        if (num_of_readings <= 5) {
          return;
        }
        this.enoughData = true;

        // If the number of total readings is less than the number the
        // user wants to show.
        if (num_of_readings < this.num_of_results_to_show) {
          if (this.lineChart !== undefined) {
            this.lineChart.destroy();
          }
          this.buildChart();
          this.getMoreStats();
          return;
        }

        // Starts to build out what is going to be shown to the user.
        const returnResults = [];

        if (this.num_of_results_to_show === -1) {
          this.num_of_results_to_show = this.stats_G.length;
          if (this.lineChart !== undefined) {
            this.lineChart.destroy();
          }
          this.buildChart();
          this.getMoreStats();
          console.log('User wants to see ALL results: ' + this.stats_G.length);
          return;
        }

        // Creates the "skip" or hop between readings. The more readinds the greater the skip.
        const mod = Math.floor(num_of_readings / this.num_of_results_to_show) + 1;

        // Add the first reading to the start of the results
        returnResults.push(this.stats_G[0]);

        // Filters the results by the mod number.
        for (let i = 1; i < num_of_readings; i++) {
          if (i % mod === 0) {
            returnResults.push(this.stats_G[i]);
          }
        }

        // Add the last latest value
        returnResults.push(this.stats_G[num_of_readings - 1]);
        this.stats_G = returnResults;

        // Builds out the chart.
        if (this.lineChart !== undefined) {
          this.lineChart.destroy();
        }
        this.buildChart();
        this.getMoreStats();
        console.log('Number of TOTAL readings: ' + num_of_readings);
        console.log('Number of results User wants to see: ' + this.num_of_results_to_show);
        console.log('Number of results currently being SHOWN: ' + returnResults.length);

      } else {
        console.log('No brew stats in the Google sheet.');
      }
      this.loadingStats = false;
    });
  }

  public getMoreStats() {
    this.latestGravity = this.stats_G[this.stats_G.length - 1].gravity;
    this.latestTemp = (this.stats_G[this.stats_G.length - 1].temperature).toString() + '° F';
    this.latestReading = this.stats_G[this.stats_G.length - 1].date;
    this.originalGravity = this.stats_G[0].gravity;
    this.units = true;
    this.currABV = ((this.originalGravity  - this.latestGravity ) * 131.25).toFixed(2).toString() + '%';
    this.day = Math.round(((new Date(this.latestReading)).valueOf() - (new Date(this.stats_G[0].date)).valueOf()) / (1000 * 60 * 60 * 24));
    this.brewName = this.stats_G[0].brew_name;
    // All of this is depreicated for moment. Getting the following warning:
    // Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.
    // moment construction falls back to js Date(),
    // const date = moment.utc(this.stats_G[0].date);
    // date.add(1, 'month'); // date operations follow date-math logic
    // const s = date.format('MM/DD/YY');
    // this.brewDate = s;
    const date = moment.utc(new Date(this.stats_G[0].date)).format('MM/DD/YY');
    // date.add(1, 'month'); // date operations follow date-math logic
    this.brewDate = date;
  }

  public onTempUnitChange($event) {
    this.lineChart.destroy();
    if (this.units) {
        // Need to change to Celcius
        this.units = false;
        this.stats_G.forEach(stat => {
          let temp = stat.temperature;
          temp = ((stat.temperature - 32) / 1.8);
          stat.temperature = parseFloat(temp.toFixed(1));
        });
        const temp2 = (this.stats_G[this.stats_G.length - 1].temperature).toFixed(1);
        this.latestTemp = temp2.toString() + '° C';
        this.buildChart();
    } else {
      // Need to change to Fernhight
      this.units = true;
      this.stats_G.forEach(stat => {
        let temp = stat.temperature;
        temp = ((stat.temperature * 1.8) + 32);
        stat.temperature = parseFloat(temp.toFixed(1));
      });
      const temp2 = (this.stats_G[this.stats_G.length - 1].temperature).toFixed(1);
      this.latestTemp = temp2.toString() + '° F';
      this.buildChart();
    }
  }

  public buildChart() {
    this.canvas = document.getElementById('lineChart');
    this.ctx = this.canvas.getContext('2d');
    this.lineChart = new Chart(this.ctx, {
      type: 'line',

      data: {
          labels: this.stats_G.map(function(stat) {
            return stat.date;
          }),
          datasets: [
            {
              label: 'Temperature',
              data: this.stats_G.map(function(stat) {
                return stat.temperature;
              }),
              fill: false,
              borderWidth: 5,
              pointBorderWidth: 2,
              pointBackgroundColor: 'rgba(134, 179, 218, 1)',
              borderColor: '#2780e3',
              order: 1,
              yAxisID: 'temp'

          },
          {
            label: 'Gravity',
            data: this.stats_G.map(function(stat) {
              return stat.gravity;
            }),
            fill: false,
            borderWidth: 5,
            pointBorderWidth: 2,
            pointBackgroundColor: 'rgba(177, 224, 154, 1)',
            borderColor: '#3fb618',
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
              labelString: this.units ? 'Temperature °F' : 'Temperature °C',
              fontSize: 24,
              display: true
            },
            ticks: {
              fontSize: 14,
              max: this.units ? 80 : 27,
              min: this.units ? 40 : 4,
              stepSize: this.units ? 3 : 2
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
              display: false
            },
            ticks: {
              autoSkip: true,
              maxRotation: 90,
              minRotation: 15,
              max: 20,
              min: 5,
              fontSize: 14
            }
          }],
        },
        events: ['click', 'mousemove']
      }
    });
  }



}
