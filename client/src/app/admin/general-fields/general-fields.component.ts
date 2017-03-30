import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../shared/general/general.service';
import { About } from '../../models/about';
import { NotificationsService } from 'angular2-notifications';
import { GeocodeService } from '../../shared/map/geocode.service';

@Component({
    selector: 'app-general-fields',
    templateUrl: './general-fields.component.html',
    styleUrls: ['./general-fields.component.scss']
})
export class GeneralFieldsComponent implements OnInit {
    form: FormGroup;
    saved: boolean = false;
    about: About = { location: {}};

    constructor(private gs: GeneralService,
                private fb: FormBuilder,
                private notif: NotificationsService,
                private geocode: GeocodeService) {
    }

    ngOnInit() {

        this.form = this.fb.group({
            description: ['', [<any>Validators.required]],
            location: this.fb.group({
                address: ['', <any>Validators.required],
                addressNumber: [''],
                postalCode: [''],
                city: ['', <any>Validators.required],
                country: ['']
            }),
            mobile: [''],
            business: [''],
            email: ['', [<any>Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
            mailbox: ['']
        });

        this.gs.getAbout()
            .subscribe(
                about => this.updateForm(about),
                err => this.notif.error(
                    'Innlastingsfeil (om chriba)',
                    err.json().error || err.json())
            );
    }

    localize(values) {

        if (!values.location) {
            return;
        }

        this.notif.info('Søker etter posisjon', `Adresse: ${values.location.address}`);

        this.geocode.localize(values.location)
            .then((location) => {
                this.notif.remove();

                if (!location) {
                    const { address, addressNumber, postalCode, city } = values.location;
                    return this.notif.error(
                        'Klarte ikke å hente posisjon',
                        `Klarte ikkje å hente posisjonen til addressen ${address} ${addressNumber}, ${postalCode} ${city}`);
                }

                this.notif.success('Posisjon funnet', `Posisjonen er funnet ved lat: ${location.lat} og long: ${location.long}`);
                this.about.location.lat = location.lat;
                this.about.location.long = location.long;
            })
            .catch(err => this.notif.error('Klarte ikke å hente posisjon', err.message));

    }

    save(data, valid): void {
        if (!valid) {
            this.notif.alert('Ugyldig skjemaverdier', 'Om Chriba har ugyldige verdier, og kan ikkje lagres');
            return;
        }

        data.location.lat = this.about.location.lat;
        data.location.long = this.about.location.long;

        this.gs.save(data)
            .subscribe((about) => {
                    this.updateForm(about);
                    this.saved = true;
                    this.notif.success('Lagret (om chriba)', 'De nye verdiene har blitt lagret og siden er blitt oppdatert');
                }, (err) => {
                    this.notif.error(
                        'Lagringsfeil (om chriba)',
                        err.json().error || err.json());
                    this.saved = false;
                }
            );
    }

    private updateForm(about: About): void {
        this.about = about;
        this.form.patchValue(about);
    }
}