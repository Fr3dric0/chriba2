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
            this.err = new Error('Uknown Error');
            //noinspection TypeScriptUnresolvedVariable
            this.err.description = `Something went wrong in the application`;
        }
    }

    // No need to keep the fields when the user exits the component
    ngOnDestroy() {
        this.es.resetFields();
    }


}