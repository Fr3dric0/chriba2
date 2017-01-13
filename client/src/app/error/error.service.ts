import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService {
    errKey: string = 'ch_err_status';
    errTitle: string = 'ch_err';
    errMsg: string = 'ch_err_msg';

    constructor (private router: Router) {}

    /**
     * @param   {Error}     err     Contains the error details
     * Reroutes the object to the error component,
     * and set's the error details.
     * */
    launchError(err: Error): void {
        this.setErrors(err);

        const r: any[] = ['error'];
        //noinspection TypeScriptUnresolvedVariable
        if (err.status) {
            //noinspection TypeScriptUnresolvedVariable
            r.push(err.status);
        }

        this.router.navigate(r);
    }

    /**
     * Removes all the error-fields from the localStorage
     * @return {boolean}
     * */
    resetFields(): boolean {
        try {
            localStorage.removeItem(this.errKey);
            localStorage.removeItem(this.errMsg);
            localStorage.removeItem(this.errTitle);
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }

    /**
     * Checks if some of the required error-fields exists
     * @return  {boolean}
     * */
    hasErrors (): boolean {
        const status = localStorage.getItem(this.errKey);
        const msg = localStorage.getItem(this.errTitle);

        return (!!msg || !!status);
    }


    /**
     * @param   {Error}     err     Object with error messages
     * Places the error-data in localStorage, thus making them accessible later
     * */
    setErrors(err: Error): boolean {
        try {
            localStorage.setItem(this.errTitle, err.message);
            //noinspection TypeScriptUnresolvedVariable
            const status = err.status.toString();
            localStorage.setItem(this.errKey, status);
            //noinspection TypeScriptUnresolvedVariable
            localStorage.setItem(this.errMsg, err.description);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Extracts the error fields from localStorage
     * @return {Error}
     * */
    getError (): Error {
        let err: Error;

        const status = this.getStatus();
        const title = this.getTitle();
        const msg = this.getMsg();

        err = new Error(title || 'Unknown Error');
        if (status) {
            //noinspection TypeScriptUnresolvedVariable
            err.status = status;
        }
        if (msg) {
            //noinspection TypeScriptUnresolvedVariable
            err.description = msg;
        }

        return err;
    }

    private getStatus (): number {
        const statusStr: string = localStorage.getItem(this.errKey);
        let status: number;
        try {
            status = parseFloat(statusStr);
        } catch(e) {
            status = undefined;
        }
        return status;
    }

    private getTitle (): string {
        return localStorage.getItem(this.errTitle);
    }

    private getMsg(): string {
        return localStorage.getItem(this.errMsg);
    }

}