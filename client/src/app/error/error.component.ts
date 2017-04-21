import { Component, OnInit } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
    page: string;

    constructor(private angulartics2: Angulartics2) {}

    ngOnInit() {
        this.page = window.location.href;

        this.angulartics2.eventTrack.next({
            action: '404PageNotFound',
            properties: {
                category: 'error',
                label: this.page
            }
        });
    }
}