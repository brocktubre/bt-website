import { BrewStatsObj } from './../models/brew-stats-object.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

@Injectable()
export class BrewService {

  constructor(private http: HttpClient) { }

  public getBrewStats(): Observable<Array<BrewStatsObj>> {
    const sendResult = new Subject<Array<BrewStatsObj>>();

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json;');
    const httpOptions = {
      headers: headers
    };
    const getUrl = environment.brewStats.jsonUrlPreviousBrews;
    const getWorkingURL = this.http.get(getUrl, httpOptions);
    getWorkingURL.subscribe((url: any) => {
      if (url.feed.entry === undefined) {
        sendResult.error('There was an error getting the URL for the brew stats.');
      }

      const workingURL = url.feed.entry[url.feed.entry.length - 1].gsx$brewurl.$t;
      // if (environment.production) {
      //   workingURL = url.feed.entry[1].gsx$url.$t;
      // }

      const getAllBrewStats = this.http.get(workingURL, httpOptions);
      getAllBrewStats.subscribe((results: any) => {
          const brewStats = new Array<BrewStatsObj>();
          if (results.feed.entry !== undefined) {
            results.feed.entry.forEach(reading => {
              const stat = new BrewStatsObj();
              stat.reading_id = reading.id.$t;
              const date = moment(reading.gsx$timestamp.$t).add('3', 'hours').format('MM/DD/YY hh:mm A');
              stat.date = date;
              stat.gravity = reading.gsx$sg.$t;
              stat.temperature = reading.gsx$temp.$t;
              stat.photos_url = url.feed.entry[url.feed.entry.length - 1].gsx$photosurl.$t;
              stat.embedded = url.feed.entry[url.feed.entry.length - 1].gsx$embedded.$t;
              stat.done = (url.feed.entry[url.feed.entry.length - 1].gsx$done.$t === 'TRUE') ? true : false;
              // stat.brew_name = previousBrews.gsx$brewname.$t;
              brewStats.push(stat);
              brewStats[0].brew_name = results.feed.entry[0].gsx$beer.$t;
            });
          } else {
            sendResult.error('There was an error getting brew stats.');
          }
          sendResult.next(brewStats);
      }, (error) => {
        sendResult.error('There was an getting the current brew\'s stats.');
      });
    }, (error) => {
      sendResult.error('There was an retrieveing working URL.');
    });
    return sendResult.asObservable();
  }

  public getPreviousBrewStats(id: number): Observable<Array<BrewStatsObj>> {
    const sendResult = new Subject<Array<BrewStatsObj>>();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json;');
    const httpOptions = {
      headers: headers
    };
    const getUrl = environment.brewStats.jsonUrlPreviousBrews;
    const getWorkingURL = this.http.get(getUrl, httpOptions);
    getWorkingURL.subscribe((url: any) => {
      if (url.feed.entry === undefined) {
        sendResult.error('There was an error getting the URL for the brew stats.');
      }

      const cellNumber = (id - 2);
      if (cellNumber > url.feed.entry.length || id <= 0) {
        sendResult.error('Brew id of ' +  id + ' does not exist.');
      }
      const workingURL = url.feed.entry[cellNumber].gsx$brewurl.$t;

      const getAllBrewStats = this.http.get(workingURL, httpOptions);
      getAllBrewStats.subscribe((results: any) => {
          const brewStats = new Array<BrewStatsObj>();
          if (results.feed.entry !== undefined) {
            results.feed.entry.forEach(reading => {
              const stat = new BrewStatsObj();
              stat.id = cellNumber;
              stat.reading_id = reading.id.$t;
              const date = moment(reading.gsx$timestamp.$t).add('3', 'hours').format('MM/DD/YY hh:mm A');
              stat.date = date;
              stat.gravity = reading.gsx$sg.$t;
              stat.temperature = reading.gsx$temp.$t;
              stat.photos_url = url.feed.entry[cellNumber].gsx$photosurl.$t;
              stat.embedded = url.feed.entry[cellNumber].gsx$embedded.$t;
              stat.id = id;
              stat.done = (url.feed.entry[cellNumber].gsx$done.$t === 'TRUE') ? true : false;
              brewStats.push(stat);
              brewStats[0].brew_name = results.feed.entry[0].gsx$beer.$t;
            });
          } else {
            sendResult.error('There was an error getting brew stats.');
          }
          sendResult.next(brewStats);
        }, (error) => {
          sendResult.error('There was an getting a previous brew\'s stats.');
        });
    }, (error) => {
        sendResult.error('There was an retrieveing working URL.');
    });
    return sendResult.asObservable();
  }

  public getPreviousBrewsTable(): Observable<Array<BrewStatsObj>> {
    const sendResult = new Subject<Array<BrewStatsObj>>();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json;');
    const httpOptions = {
      headers: headers
    };
    const getUrl = environment.brewStats.jsonUrlPreviousBrews;
    const getWorkingURL = this.http.get(getUrl, httpOptions);
    getWorkingURL.subscribe((results: any) => {
      if (results.feed.entry === undefined) {
        sendResult.error('There was an error getting the URL for the brew stats.');
      }

      const previousBrewsList = new Array<BrewStatsObj>();
      let brewId = 2;
      if (results.feed.entry !== undefined) {
        results.feed.entry.forEach((previousBrews) => {
          const prevBrew = new BrewStatsObj();
          prevBrew.id = brewId;
          prevBrew.brew_name = previousBrews.gsx$brewname.$t;
          prevBrew.date = previousBrews.gsx$brewdate.$t;
          prevBrew.photos_url = previousBrews.gsx$photosurl.$t;
          prevBrew.embedded = previousBrews.gsx$embedded.$t;
          prevBrew.done = (previousBrews.gsx$done.$t === 'TRUE') ? true : false;
          brewId++;
          previousBrewsList.push(prevBrew);
        });
        sendResult.next(previousBrewsList);
      } else {
        sendResult.error('There was an error retrieveing previous brews list.');
      }
    }, (error) => {
        sendResult.error('There was an error retrieveing working URL.');
    });
    return sendResult.asObservable();
  }

  public getBrewPhotos(url: string): Observable<Array<any>> {
    const sendResult = new Subject<Array<any>>();

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json;');
    const httpOptions = {
      headers: headers
    };
    const getImages = this.http.get(url, httpOptions);
    getImages.subscribe((photos: any) => {
     debugger;
    }, (error) => {
      sendResult.error('There was an retrieveing brew images.');
    });
    return sendResult.asObservable();
  }

}
