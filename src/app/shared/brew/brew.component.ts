import { BrewService } from './brew.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Chart from 'chart.js';
import { BrewStatsObj } from '../models/brew-stats-object.model';
import * as moment from 'moment';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ActivatedRoute } from '@angular/router';

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
  public latestGravity: string;
  public latestReading: string;
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
  public num_of_readings: number;
  public apparent_attenuation: string;

  @ViewChild('brewID') brewID: ElementRef;

  constructor(private brewService: BrewService, private activeRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.loadingStats = true;
    this.statsAvailable = false;
    this.enoughData = false;

    const brewId = this.activeRoute.snapshot.params['id'];

    if (brewId === undefined) {
      this.filterReadings(this.num_of_results_to_show);
      // refresh every 15 minutes.
      setInterval(() => {
        this.filterReadings(this.num_of_results_to_show);
        }, 90000);
    } else {
      this.filterPreviousReadings(this.num_of_results_to_show, brewId);
      // refresh every 15 minutes.
      setInterval(() => {
        this.filterPreviousReadings(this.num_of_results_to_show, brewId);
        }, 90000);
    }
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

        this.num_of_readings = this.stats_G.length;
        console.log('There are brew stats in the Google sheet. Number of readings: ' + this.num_of_readings);

        // Not enough data collected. Show alert warning.
        if (this.num_of_readings <= 2) {
          return;
        }
        this.enoughData = true;

        // If the number of total readings is less than the number the
        // user wants to show.
        if (this.num_of_readings < this.num_of_results_to_show) {
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
        const mod = Math.floor(this.num_of_readings / this.num_of_results_to_show) + 1;

        // Add the first reading to the start of the results
        returnResults.push(this.stats_G[0]);

        // Filters the results by the mod number.
        for (let i = 1; i < this.num_of_readings; i++) {
          if (i % mod === 0) {
            returnResults.push(this.stats_G[i]);
          }
        }

        if (this.stats_G[this.num_of_readings - 1].reading_id !== returnResults[returnResults.length - 1].reading_id) {
          // Add the last latest value
          returnResults.push(this.stats_G[this.num_of_readings - 1]);
        }

        this.stats_G = returnResults;

        // Builds out the chart.
        if (this.lineChart !== undefined) {
          this.lineChart.destroy();
        }
        this.buildChart();
        this.getMoreStats();
        console.log('Number of TOTAL readings: ' + this.num_of_readings);
        console.log('Number of results User wants to see: ' + this.num_of_results_to_show);
        console.log('Number of results currently being SHOWN: ' + returnResults.length);

      } else {
        console.log('No brew stats in the Google sheet.');
      }
      this.loadingStats = false;
    });
  }

  public filterPreviousReadings(num: number, brewId: number) {
    this.num_of_results_to_show = num;
    this.brewService.getPreviousBrewStats(brewId).subscribe((stats) => {
      // Are there any results?
      if (stats.length > 0) {
        this.stats_G = stats;
        this.units = true;
        this.statsAvailable = true;
        this.loadingStats = false;

        this.num_of_readings = this.stats_G.length;
        console.log('There are brew stats in the Google sheet. Number of readings: ' + this.num_of_readings);

        // Not enough data collected. Show alert warning.
        if (this.num_of_readings <= 2) {
          return;
        }
        this.enoughData = true;

        // If the number of total readings is less than the number the
        // user wants to show.
        if (this.num_of_readings < this.num_of_results_to_show) {
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
        const mod = Math.floor(this.num_of_readings / this.num_of_results_to_show) + 1;

        // Add the first reading to the start of the results
        returnResults.push(this.stats_G[0]);

        // Filters the results by the mod number.
        for (let i = 1; i < this.num_of_readings; i++) {
          if (i % mod === 0) {
            returnResults.push(this.stats_G[i]);
          }
        }

        if (this.stats_G[this.num_of_readings - 1].reading_id !== returnResults[returnResults.length - 1].reading_id) {
          // Add the last latest value
          returnResults.push(this.stats_G[this.num_of_readings - 1]);
        }

        this.stats_G = returnResults;

        // Builds out the chart.
        if (this.lineChart !== undefined) {
          this.lineChart.destroy();
        }
        this.buildChart();
        this.getMoreStats();
        console.log('Number of TOTAL readings: ' + this.num_of_readings);
        console.log('Number of results User wants to see: ' + this.num_of_results_to_show);
        console.log('Number of results currently being SHOWN: ' + returnResults.length);

      } else {
        console.log('No brew stats in the Google sheet.');
      }
      this.loadingStats = false;
    });
  }

  public getMoreStats() {
    this.latestGravity = Number((this.stats_G[this.stats_G.length - 1].gravity)).toFixed(3).toString();
    this.latestTemp = (this.stats_G[this.stats_G.length - 1].temperature).toString() + '° F';
    this.latestReading = this.stats_G[this.stats_G.length - 1].date;
    this.originalGravity = this.stats_G[0].gravity;
    this.units = true;
    this.currABV = ((this.originalGravity  - this.stats_G[this.stats_G.length - 1].gravity) * 131.25).toFixed(2).toString() + '%';

    // AA = (OG – FG)/OG
    // const og_whole = ((this.originalGravity - 1) * 1000);
    // const latest_whole = ((parseFloat(this.latestGravity) - 1) * 1000);
    // this.apparent_attenuation = ((og_whole - latest_whole) / this.originalGravity).toFixed(2).toString() + '%';
    // tslint:disable-next-line:max-line-length
    this.apparent_attenuation = (((this.originalGravity - parseFloat(this.latestGravity)) / (this.originalGravity - 1)) * 100).toFixed(2).toString() + '%';

    this.day = Math.round(((new Date(this.latestReading)).valueOf() - (new Date(this.stats_G[0].date)).valueOf()) / (1000 * 60 * 60 * 24));
    this.day = this.day + 1;
    this.brewName = this.stats_G[0].brew_name;
    // All of this is depreicated for moment. Getting the following warning:
    // Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.
    // moment construction falls back to js Date(),
    // const date = moment.utc(this.stats_G[0].date);
    // date.add(1, 'month'); // date operations follow date-math logic
    // const s = date.format('MM/DD/YY');
    // this.brewDate = s;
    const date = moment(new Date(this.stats_G[0].date)).format('MM/DD/YY');
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
              yAxisID: 'temp',
              lineTension: 0

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
            yAxisID: 'gravity',
            lineTension: 0
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
              max: this.units ? 85 : 40,
              min: this.units ? 30 : 4,
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
              min: 0.990,
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
