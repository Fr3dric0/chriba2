/**
 * Created by toma2 on 02.02.2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";
import { Estate, normalizeEstate } from "../models/estate";
import { AuthService } from '../shared/auth/auth.service';

@Injectable()
export class EstatesService {
    constructor(private http: Http,
                private auth: AuthService) {

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
        return this.http.delete(`/api/estates/${estate.name}`, { headers })
            .map(res => res.json());
    }

    save(estate: Estate): Observable<Estate> {
        // If either one of these fields are missing, it would
        // imply that the estate has not been created before.
        const e = normalizeEstate(estate);
        if (!estate.name || !estate._id) {
            return this.create(e);
        }

        const headers = this.auth.getAuthHeader();

        return this.http.put(`/api/estates/${e.name}`, e, { headers })
            .map(res => res.json());
    }

    /**
     * Is called through save()
     * */
    private create(estate: Estate): Observable<Estate> {
        const headers = this.auth.getAuthHeader();
        return this.http.post(`/api/estates`, estate, { headers })
            .map(res => res.json());
    }



}
