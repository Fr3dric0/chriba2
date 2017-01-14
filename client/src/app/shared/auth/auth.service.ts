import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    private tokenKey: string = 'ch_token';
    private authUrl: string = '/api/admin/token';
    private authValChange = new BehaviorSubject<boolean>(false);
    authStatus = this.authValChange.asObservable();

    constructor(private http: Http) {
        this.updateAuth();
    }

    authenticate(email: string, password: string): Promise<boolean> {
        return new Promise((rsv, rr) => {
            this.http.post(this.authUrl, { email, password })
                .map(res => res.json())
                .subscribe((data) => {
                    localStorage.setItem(this.tokenKey, data.token);
                    this.updateAuth();
                    rsv(true);
                }, err => rr(err));
        });
    }

    /**
     * Removes the token from localStorage, whereas the admin
     * can no longer call protected routes, thus logging him out.
     * */
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.updateAuth();
    }

    getToken(): string {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * When other services would like to
     * send HTTP-request, a header containing a token is usually
     * required. This method can be called to get this header
     * @return {Headers}
     * */
    getAuthHeader(): Headers {
        const headers = new Headers();
        headers.append('Authorization', this.getToken());
        return headers;
    }

    /**
     * Checks if user is authenticated or not
     * @return {boolean}
     * */
    authenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey); // Uses !! to force value to be a boolean
    }

    /**
     * Updates the value in the authStatus property, which
     * components can subscribe on. Giving them a running status
     * on the user authentication
     * */
    updateAuth() {
        this.authValChange.next(this.authenticated());
    }
}