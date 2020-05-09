import { BrewStatsObj } from './../models/brew-stats-object.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';

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
              stat.reading_id = reading.gsx$readingid.$t;
              stat.date = reading.gsx$date.$t;
              stat.gravity = reading.gsx$gravity.$t;
              stat.temperature = reading.gsx$temperature.$t;
              brewStats.push(stat);
            });
          }
          sendResult.next(brewStats);
          // sendResult.next(results);
      });
      return sendResult.asObservable();
  }

}
