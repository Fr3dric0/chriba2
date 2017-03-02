import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";

@Injectable()
export class GeneralService {
  constructor(private http: Http) {

  }
  
  /**
   * @returns {Observable<R>}
   * GET request for ABOUT data
   */
  getAbout(): Observable<any> {
    return this.http.get('/api/general')
      .map(res => res.json());
  }
}
