import { Injectable } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { Http, Headers } from '@angular/http';
import { Admin } from '../models/admin';
import { Observable } from 'rxjs';

@Injectable()
export class AdminService {

    constructor(private auth: AuthService,
                private http: Http) {

    }

    find(): Observable<Admin> {
        const headers: Headers = this.auth.getAuthHeader();

        return this.http.get('/api/admin', { headers })
            .map( res => res.json());
    }

    save(admin: Admin): Observable<Admin> {
        const headers: Headers = this.auth.getAuthHeader();

        return this.http.patch('/api/admin', admin, {headers})
            .map( res => res.json());
    }
}