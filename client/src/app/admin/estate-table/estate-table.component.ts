import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { Estate } from '../../models/estate';
import { EstatesService } from '../../estates/estates.service';

@Component({
    selector: 'app-estate-field',
    templateUrl: './estate-table.component.html',
    styleUrls: ['./estate-table.component.scss']
})
export class EstateTableComponent implements OnInit {

    estates: Estate[];


    constructor (private es: EstatesService,
                 private notif: NotificationsService) { }

    ngOnInit() {

        this.es.find()
            .subscribe(
                estates => this.estates = estates,
                err => this.notif.error('Project Loading Error', err.message)
            );
    }

    remove(estate: Estate) {
        if (!confirm(`Sikker på at du vil fjerne: ${estate.location.address}?`)) {
            return;
        }

        this.es.remove(estate)
            .subscribe(
                (status) => {
                    this.estates = this.estates.filter( p => p.name !== estate.name);

                    this.notif.success(`Prosjekt fjernet`, `${estate.location.address} er fjernet`)
                },
                (err) => {
                    this.notif.error(`Fjerning av prosjekt feilet`, err.message)
                }
            )
    }
}