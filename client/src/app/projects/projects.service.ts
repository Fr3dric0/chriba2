/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs";
import { Project } from "../models/project";
import { AuthService } from '../shared/auth/auth.service';
import { XHRService } from '../shared/xhr.service';
import { CRUDService } from '../shared/crud.service';

@Injectable()
export class ProjectsService extends CRUDService<Project> {

    constructor(protected http: Http,
                private auth: AuthService,
                private xhr: XHRService) {
        super(http);

        this.usePatch = true;
        this.path = '/api/projects';
        this.token = this.auth.getToken();
    }

    remove (project: Project): Observable<Project> {
        return super.remove(project.name);
    }

    save(project: Project): Observable<Project> {
        if (!project.name || !project._id) {
            return super.create(project);
        }

        return super.update(project.name, project);
    }

    uploadThumb(form, project: Project): Promise<any> {
        const headers = this.auth.getAuthHeader();
        const formData: FormData = new FormData(form);

        return this.xhr.post({
            url: `/api/projects/thumb/${project.name}?size=${form.size ? form.size.value : 'large'}`
        }, headers, formData);
    }

    removeThumb(size, index, project: Project) {
        const headers = this.auth.getAuthHeader();

        return this.http.delete(
            `/api/projects/thumb/${project.name}?size=${size}`, new RequestOptions({
                headers,
                body: {
                    path: project.thumbnails[size][index]
                }
            }))
            .map( res => res.json());
    }

}
