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
    fields: any;

    constructor (private es: EstatesService,
                 private notif: NotificationsService) { }

    ngOnInit() {

        this.es.find()
            .subscribe(
                (estates) => {
                    this.estates = estates;
                    this.fields = this.createFields(estates);
                },
                err => this.notif.error('Project Loading Error', err.message)
            );
    }


    remove(id) {
        let estate:Estate = this.estates.filter(e => e.name == id)[0];

        if (!confirm(`Sikker på at du vil fjerne: ${estate.location.address}?`)) {
            return;
        }

        this.es.remove(estate)
            .subscribe(
                (status) => {
                    this.estates = this.estates.filter( p => p.name !== estate.name);
                    this.fields = this.createFields(this.estates);
                    this.notif.success(`Prosjekt fjernet`, `${estate.location.address} er fjernet`)
                },
                (err) => {
                    this.notif.error(`Fjerning av eiendom feilet`, err.json().error)
                }
            )
    }


    private createFields(estates: Estate[]) {
        if (!estates) {
            return null;
        }

        return estates.map((estate) => {
            let src = estate.thumbnails.small.length > 0 ? estate.thumbnails.small[0] : undefined;

            return {
                id: estate.name,
                image: {
                    src,
                    alt: estate.location.address
                },
                title: {
                    url: `/estates/${estate.name}`,
                    label: `${estate.location.address} ${estate.location.addressNumber || ''}<br>
                    ${estate.location.postalCode || ''} ${estate.location.city || ''}`
                },
                description: estate.description,
                modifiers: { edit: `/backdoor/estates/${estate.name}`}
            };
        });
    }
}