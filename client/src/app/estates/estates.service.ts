/**
 * Created by toma2 on 02.02.2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from "rxjs";

@Injectable()
export class EstatesService {
  constructor(private http: Http) {
    
  }
  
  find(): Observable<any> {
    return this.http.get('/api/estates')
      .map(res => res.json());
  }
}
