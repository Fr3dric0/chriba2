/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs";
import { Project } from "../models/project";
import { AuthService } from '../shared/auth/auth.service';
import { XHRService } from '../shared/xhr.service';

@Injectable()
export class ProjectsService {

    constructor(private http: Http,
                private auth: AuthService,
                private xhr: XHRService) { }

    /**
     * Finds all registered projects
     */
    find(): Observable<Project[]> {
        return this.http.get('/api/projects')
            .map(res => res.json());
    }

    findOne(name: string): Observable<Project[]> {
        return this.http.get(`/api/projects/${name}`)
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

    save(project: Project): Observable<Project> {
        if (!project.name || !project._id) {
            return this.create(project);
        }

        const headers = this.auth.getAuthHeader();

        return this.http.patch(`/api/projects/${project.name}`, project, { headers })
            .map(res => res.json());
    }

    uploadThumb(form, project: Project): Promise<any> {
        const headers = this.auth.getAuthHeader();
        const formData: FormData = new FormData(form);

        return this.xhr.post({
            url: `/api/projects/${project.name}/thumb/${form.size ? form.size.value : 'large'}`
        }, headers, formData);
    }

    removeThumb(size, index, project: Project) {
        const headers = this.auth.getAuthHeader();

        return this.http.delete(
            `/api/projects/${project.name}/thumb/${size}`, new RequestOptions({
                headers,
                body: { index }
            }))
            .map( res => res.json());
    }


    private create(project: Project): Observable<Project> {
        const headers = this.auth.getAuthHeader();

        return this.http.post('/api/projects', project, { headers })
            .map(res => res.json());
    }
}

