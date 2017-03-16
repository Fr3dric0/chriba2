/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";
import { Project } from "../models/project";

@Injectable()
export class ProjectService {
  constructor(private http: Http) {
    
  }
  
  /**
   * @returns {Observable<R>}
   * GET request for data about projects
   */
  find(): Observable<Project> {
    return this.http.get('/api/projects')
      .map(res => res.json());
  }
  
  findWithPromise(): Promise<Project[]> {
    return new Promise((rsv, rr) => {
      this.find().subscribe((data) => rsv(data), err => rr(err));
    });
  }

  findOne(name: string): Observable<Project> {
    return this.http.get(`/api/projects/${name}`)
        .map(res => res.json());
  }
}

