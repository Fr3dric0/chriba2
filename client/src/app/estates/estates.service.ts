/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";
import { Estate } from "../models/estate";

@Injectable()
export class EstatesService {
  constructor(private http: Http) {

  }

  /**
   * @returns {Observable<R>}
   * GET request for data about estates
   */
  find(): Observable<Estate> {
    return this.http.get('/api/estates')
      .map(res => res.json());
  }

  findWithPromise(): Promise<Estate[]> {
    return new Promise((rsv, rr) => {
      this.find().subscribe((data) => rsv(data), err => rr(err));
    });
  }
}
