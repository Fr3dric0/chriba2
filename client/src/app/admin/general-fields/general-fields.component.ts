import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../shared/general/general.service';
import { About } from '../../models/about';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-general-fields',
    templateUrl: './general-fields.component.html',
    styleUrls: ['./general-fields.component.scss']
})
export class GeneralFieldsComponent implements OnInit {
    form: FormGroup;

    constructor(private gs: GeneralService,
                private fb: FormBuilder,
                private notif: NotificationsService) { }

    ngOnInit() {
        // Init form
        this.form = this.fb.group({
            description: ['', [<any>Validators.required]],
            address: [''],
            addressNumber: [''],
            postalCode: [''],
            city: [''],
            country: [''],
            mobile: [''],
            business: [''],
            email: ['', [<any>Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
            mailbox: ['']
        });

        // Populate the form with realworld values
        this.gs.getAbout()
            .subscribe(
                about => this.updateForm(about),
                err => this.notif.error(
                    'Innlastingsfeil (om chriba)',
                    err.json().error || err.json())
            );
    }

    save(data, valid): void {
        if (!valid) {
            this.notif.alert('Ugyldig skjemaverdier', 'Generelt skjemaet har ugyldige verdier, og kan ikkje lagres ennå');
            return;
        }

        this.gs.save(data)
            .subscribe((about) => {
                this.updateForm(about);
                this.notif.success('Lagret (om chriba)', 'De nye verdiene har blitt lagret og siden er blitt oppdatert');
            }, err => this.notif.error(
                'Lagringsfeil (om chriba)',
                err.json().error || err.json())
            );
    }

    private updateForm(about: About): void {
        const { description, mobile, business, email, mailbox} = about;
        const { address, addressNumber, postalCode, city, country } = about.location;
        this.form.patchValue({description, address, addressNumber, postalCode, city, country, mobile, business, email, mailbox});
    }
}