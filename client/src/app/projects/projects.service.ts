/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";
import { Project } from "../models/project";
import { AuthService } from '../shared/auth/auth.service';

@Injectable()
export class ProjectsService {
    constructor(private http: Http,
                private auth: AuthService) {

    }

    /**
     * @returns {Observable<R>}
     * GET request for data about projects
     */
    find(): Observable<Project[]> {
        return this.http.get('/api/projects')
            .map(res => res.json());
    }

    findWithPromise(): Promise<Project[]> {
        return new Promise((rsv, rr) => {
            this.find().subscribe((data) => rsv(data), err => rr(err));
        });
    }

    remove (project: Project) {
        const headers = this.auth.getAuthHeader();

        return this.http.delete(`/api/projects/${project.name}`, { headers })
            .map( res => res.json());
    }

}

