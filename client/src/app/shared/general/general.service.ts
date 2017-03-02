import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from "rxjs";

@Injectable()
export class GeneralService {
  constructor(private http: Http) {

  }

  getAbout(): Observable<any> {
    return this.http.get('/api/general')
      .map(res => res.json());
  }
}
