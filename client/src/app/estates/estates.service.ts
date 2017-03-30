/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs";
import { Estate } from "../models/estate";
import { AuthService } from '../shared/auth/auth.service';
import { XHRService } from '../shared/xhr.service';

@Injectable()
export class EstatesService {
    constructor(private http: Http,
                private auth: AuthService,
                private xhr: XHRService) {

    }

    /**
     * Finds all estates
     */
    find(): Observable<Estate[]> {
        return this.http.get('/api/estates')
            .map(res => res.json());
    }

    findOne(name: string): Observable<Estate> {
        return this.http.get(`/api/estates/${name}`)
            .map(res => res.json());
    }


    findWithPromise(): Promise<Estate[]> {
        return new Promise((rsv, rr) => {
            this.find().subscribe((data) => rsv(data), err => rr(err));
        });
    }

    remove(estate: Estate): Observable<any> {
        const headers = this.auth.getAuthHeader();
        return this.http.delete(`/api/estates/${estate.name}`, {headers})
            .map(res => res.json());
    }

    save(estate: Estate): Observable<Estate> {
        // If either one of these fields are missing, it would
        // imply that the estate has not been created before.
        if (!estate.name || !estate._id) {
            return this.create(estate);
        }

        const headers = this.auth.getAuthHeader();

        return this.http.patch(`/api/estates/${estate.name}`, estate, {headers})
            .map(res => res.json());
    }

    uploadThumb(form, estate: Estate): Promise<any> {
        const headers = this.auth.getAuthHeader();
        const formData: FormData = new FormData(form);

        return this.xhr.post({
            url: `/api/estates/${estate.name}/thumb/${form.size ? form.size.value : 'large'}`
        }, headers, formData);
    }

    removeThumb(size, index, estate: Estate) {
        const headers = this.auth.getAuthHeader();

        return this.http.delete(
            `/api/estates/${estate.name}/thumb/${size}`, new RequestOptions({
                headers,
                body: { index }
            }))
            .map( res => res.json());
    }


    /**
     * Is called through save()
     * */
    private create(estate: Estate): Observable<Estate> {
        const headers = this.auth.getAuthHeader();
        return this.http.post(`/api/estates`, estate, {headers})
            .map(res => res.json());
    }

}
