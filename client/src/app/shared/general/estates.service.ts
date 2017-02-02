/**
 * Created by toma2 on 02.02.2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from "rxjs";

@Injectable()
export class GeneralService {
  constructor(private http: Http) {
    
  }
  
  getEstates(): Observable<any> {
    return this.http.get('/api/estates')
      .map(res => res.json());
  }
}
