import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';

/**
 * Generic method, which implements the basic CRUD methods
 * `create` (C), `find` (R), `findOne` (R), `update` (U) and `remove` (D).
 *
 * Built and tested to be extended by other services.
 *
 * @class: CRUDService
 * */
@Injectable()
export class CRUDService<T> {

    /*
     * Sets the base path of every request
     * `findOne`, `update` and `remove` will append '/:id' to the url
     * @type: string
     * */
    protected path: string = '';

    /*
     * If set, will decorate every request-header with this token.
     * @type: string
     * */
    protected token: string;

    /*
     * If true, will use PATCH instead of PUT
     * @type: boolean
     * */
    protected usePatch: boolean;

    /*
     * The Content-Type to use on `create` and `update `
     * @type: string
     * */
    protected contentType: string;

    constructor(protected http: Http) {
    }

    /**
     * Generic find method, will call GET and expect a list in return.
     *
     * @function: find
     * @return: {Observable<T[]>}
     * */
    find(): Observable<any> {
        const headers = this.setAuthHeader(this.token);

        return this.http.get(`${this.path}`, {headers})
            .map(res => res.json());
    }

    /**
     * Will GET a single item from the http-endpoint
     * @function: findOne
     * @param:  {number | string}  id   Identifier to decorate the request
     * @return: {Observable<T>}
     * */
    findOne(id): Observable<any> {
        const headers = this.setAuthHeader(this.token);

        return this.http.get(`${this.path}/${id}`, {headers})
            .map(res => res.json());
    }

    /**
     * Wrapper function for `find`, which returns
     * a Promise instead of an Observable
     * @function: findWithPromise
     * @return: {Promise<T[]>}
     * */
    findWithPromise(): Promise<any> {
        return new Promise((rsv, rr) => {
            this.find().subscribe(data => rsv(data), err => rr(err));
        })
    }

    /**
     * Will try to remove a specific item, distinguished by
     * the `id`.
     * @function:   remove
     * @param:  {string | number}   id  Identifier
     * @return: {Observable<T>}
     * */
    remove(id = null): Observable<T | any> {
        const headers = this.setAuthHeader(this.token);

        return this.http.delete(`${this.path}${id ? '/' + id : ''}`, {headers});
    }

    /**
     * Will try and update the a specific item,
     * either with a PUT or PATCH request (defined through `usePatch`)
     * @function: update
     * @param:  {string | number}   id      identifier. Ignored if null
     * @param:  {T}                 data    Data to update
     * */
    update(id, data: T): Observable<T | any> {
        let headers = this.setAuthHeader(this.token);
        headers = this.setContentType(headers);

        let method;

        if (this.usePatch) {
            method = this.http.patch(`${this.path}${id ? '/' + id : ''}`, data, {headers});
        } else {
            method = this.http.put(`${this.path}${id ? '/' + id : ''}`, data, {headers});
        }

        return method.map(res => res.json());
    }

    /**
     * Will try to create the provided resource
     * @function:   create
     * @param:  {T}                 data    Data to create
     * @param:  {string | number}   id?     Optional `id`
     * */
    create(data: T, id = null): Observable<T | any> {
        let headers = this.setAuthHeader(this.token);
        headers = this.setContentType(headers);

        return this.http.post(`${this.path}${id ? '/' + id : ''}`, data, {headers})
            .map(res => res.json());
    }

    /**
     * Will set content type the content-type
     * @param:  {Headers}   headers     Header-object to update
     * */
    private setContentType(headers: Headers): Headers {
        if (this.contentType) {
            headers.append('Content-Type', this.contentType);
        } else {
            headers.append('Content-Type', 'application/json');
        }

        return headers;
    }

    private setAuthHeader(token: string): Headers {
        const headers = new Headers();

        if (token) {
            headers.append('Authorization', token);
        }

        return headers;
    }

    protected setHeader(key: string, value: string, headers: Headers = null): Headers {
        if (!headers) {
            headers = new Headers();
        }

        headers.append(key, value);

        return headers;
    }

}