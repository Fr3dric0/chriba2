import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";
import { About } from '../../models/about';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GeneralService {
    constructor(private http: Http,
                private auth: AuthService) {

    }

    /**
     * @returns {Observable<R>}
     * GET request for ABOUT data
     */
    getAbout(): Observable<any> {
        return this.http.get('/api/general')
            .map(res => res.json());
    }

    save(about) {
        const headers = this.auth.getAuthHeader();
        return this.http.put('/api/general', about, { headers })
            .map( res => res.json());
    }
}
