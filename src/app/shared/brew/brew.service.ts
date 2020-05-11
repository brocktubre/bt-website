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
      const getUrl = environment.brewStats.jsonUrl;
      const getAllBrewStats = this.http.get(getUrl, httpOptions);
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
              brewStats.push(stat);
              brewStats[0].brew_name = results.feed.entry[0].gsx$beer.$t;
            });
          }
          sendResult.next(brewStats);
      });
      return sendResult.asObservable();
  }

}
