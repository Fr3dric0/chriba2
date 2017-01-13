import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from './error.service';


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {
    err: Error;

    constructor(private es: ErrorService) { }

    ngOnInit() {
        if (this.es.hasErrors()) {
            this.err = this.es.getError();
        } else {
            this.err = new Error('Unknown Error');
            //noinspection TypeScriptUnresolvedVariable
            this.err.description = `Something went wrong in the application`;
        }
    }

    /**
     * Clears out the fields, when the user exists the component
     * */
    ngOnDestroy() {
        this.es.resetFields();
    }


}