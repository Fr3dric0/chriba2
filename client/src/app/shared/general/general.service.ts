import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from "rxjs";

@Injectable()
export class GeneralService {
  constructor(private http: Http) {
    
  }
  
  getProjects(): Observable<any> {
    return this.http.get(`api/projects`)
      .map(res => res.json());
  }
  
  getEstates(): Observable<any> {
    return this.http.get('/api/estates')
      .map(res => res.json());
  }
  
  getAbout(): Observable<any> {
    return this.http.get('/api/general')
      .map(res => res.json());
  }
}
