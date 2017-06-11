/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs";
import { Estate } from "../models/estate";
import { AuthService } from '../shared/auth/auth.service';
import { XHRService } from '../shared/xhr.service';
import { CRUDService } from '../shared/crud.service';

@Injectable()
export class EstatesService extends CRUDService<Estate> {
    constructor(protected http: Http,
                private auth: AuthService,
                private xhr: XHRService) {
        super(http);

        this.usePatch = true;
        this.path = '/api/estates';
        this.token = this.auth.getToken();
    }

    remove(estate: Estate): Observable<Estate> {
        return super.remove(estate.name);
    }

    save(estate: Estate): Observable<Estate> {
        // If either one of these fields are missing, it would
        // imply that the estate has not been created before.
        if (!estate.name || !estate._id) {
            return super.create(estate);
        }

        return super.update(estate.name, estate);
    }

    uploadThumb(form, estate: Estate): Promise<any> {
        const headers = this.auth.getAuthHeader();
        const formData: FormData = new FormData(form);

        return this.xhr.post({
            url: `/api/estates/thumb/${estate.name}?size=${form.size ? form.size.value : 'large'}`
        }, headers, formData);
    }

    removeThumb(size, index, estate: Estate) {
        const headers = this.auth.getAuthHeader();

        return this.http.delete(
            `/api/estates/thumb/${estate.name}?size=${size}`, new RequestOptions({
                headers,
                body: {
                    path: estate.thumbnails[size][index]
                }
            }))
            .map( res => res.json());
    }

}