import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error/error.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

    constructor(private es: ErrorService) {
    }

    ngOnInit() {
        // Testing of error component
        // setTimeout(() => {
        //     const err = new Error('Authentication Error');
        //     err.status = 403;
        //     err.description = `We could not successfully login with your user. Please check your login-credentials`;
        //     this.es.launchError(err);
        // }, 2000);
    }

}
