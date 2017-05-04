import { Injectable } from '@angular/core';
import { Headers } from "@angular/http";
import { XHRError } from '../models/XHRError';
import { XHR } from '../models/xhr';


@Injectable()
export class XHRService {

    get(opt: XHR, headers?: Headers, body?: FormData | Object): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = this.initXHR({url: opt.url, token: opt.token, method: 'GET'}, headers);

            xhr.addEventListener('load', () => {
                try {
                    let data = this.loadHandler(xhr);
                    return resolve(data);
                } catch (e) {
                    return reject(e);
                }
            });

            xhr.addEventListener('error', () => {
                let err: Error;
                try {
                    err = this.errorHandler(xhr);
                } catch (e) {
                    err = e;
                }
                return reject(err);
            });

            xhr.send(body);
        });
    }

    post(opt: XHR, headers?: Headers, body?: FormData | Object): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = this.initXHR({url: opt.url, token: opt.token, method: 'POST'}, headers);

            xhr.addEventListener('load', () => {
                try {
                    let data = this.loadHandler(xhr);
                    return resolve(data);
                } catch (e) {
                    return reject(e);
                }
            });

            xhr.addEventListener('error', () => {
                let err: Error;
                try {
                    err = this.errorHandler(xhr);
                } catch (e) {
                    err = e;
                }
                return reject(err);
            });

            xhr.send(body);
        });
    }

    put(opt: XHR, headers?: Headers, body?: FormData | Object): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = this.initXHR({url: opt.url, token: opt.token, method: 'PUT'}, headers);

            xhr.addEventListener('load', () => {
                try {
                    let data = this.loadHandler(xhr);
                    return resolve(data);
                } catch (e) {
                    return reject(e);
                }
            });

            xhr.addEventListener('error', () => {
                let err: Error;
                try {
                    err = this.errorHandler(xhr);
                } catch (e) {
                    err = e;
                }
                return reject(err);
            });

            xhr.send(body);
        });
    }

    delete(opt: XHR, headers?: Headers, body?: FormData | Object): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = this.initXHR({url: opt.url, token: opt.token, method: 'DELETE'}, headers);

            xhr.addEventListener('load', () => {
                try {
                    let data = this.loadHandler(xhr);
                    return resolve(data);
                } catch (e) {
                    return reject(e);
                }
            });

            xhr.addEventListener('error', () => {
                let err: Error;
                try {
                    err = this.errorHandler(xhr);
                } catch (e) {
                    err = e;
                }
                return reject(err);
            });

            xhr.send(body);
        });
    }

    private initXHR({url, method, token}, headers: Headers): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        xhr.open(method.toLowerCase(), url);
        xhr = this.setHeaders(xhr, headers);

        if (token) {
            xhr.setRequestHeader('Authorization', token);
        }

        return xhr;
    }

    private setHeaders(xhr:XMLHttpRequest, headers: Headers): XMLHttpRequest {
        if (headers && 'forEach' in headers) {
            headers.forEach((val, key) => {
                xhr.setRequestHeader(key, val[0]);
            });
        }

        return xhr;
    }


    private loadHandler(xhr) {
        let res = xhr.responseText;
        let data: Object;

        // Convert response to JSON
        try {
            data = JSON.parse(res);
        } catch(e) {
            throw this.errorHandler(xhr);
        }

        // Catch error-responses
        if (xhr.status > 399 || xhr.status < 200) {
            throw this.errorHandler(xhr);
        }

        return data;
    }

    private errorHandler(xhr: XMLHttpRequest, data?: Object): XHRError {
        let err = new XHRError();

        let obj;
        if (data) {
            obj = data;
        } else {
            try {
                obj = JSON.parse(xhr.responseText);
            } catch(e) {

                // Add a simple check for 413 error
                if (xhr.status == 413) {
                    obj = { error: `[XHR Error] File size to large` };
                } else {
                    obj = { error: '[XHR Error] Unknown response format' };
                }

                err.stack = xhr.responseText; // Put original text in as stack
            }
        }

        err.message = obj.error || obj.err || obj || '[XHR Error] Unknown';
        err.status = xhr.status;

        return err;
    }
}