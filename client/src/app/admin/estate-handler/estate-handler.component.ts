import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { EstatesService } from '../../estates/estates.service';
import { Estate } from '../../models/estate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeocodeService } from '../../shared/map/geocode.service';

@Component({
    selector: 'app-admin-estate-handler',
    templateUrl: './estate-handler.component.html',
    styleUrls: ['./estate-handler.component.scss']
})
export class EstateHandlerComponent implements OnInit {
    estate: Estate = { _id: null, location: { address: ''}};
    form: FormGroup;
    name: string;

    constructor(private es: EstatesService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private geocode: GeocodeService,
                private notif: NotificationsService) {}

    ngOnInit() {
        this.form = this.fb.group({
            description: [null],
            size: [null],
            uploaded: [null],
            address: [null, <any>Validators.required],
            addressNumber: [null],
            postalCode: [null],
            city: [null],
            url: [null]
        });


        this.route.params.subscribe((params: Params) => {
            const { name } = params;

            if (!name) {
                return;
            }

            this.es.findOne(name).subscribe(
                (estate) => {
                    if (!estate) {
                        return this.notif.alert('Fant ikkje eiendom', `Fant ikke eiendom: ${name}`);
                    }

                    this.updateForm(estate);

                },
                err => this.notif.error('Klarte ikke å hente eiendom', err.message));

            this.name = name;
        })
    }

    localize(values) {
        const fields = ['address', 'postalCode', 'city'];
        const address = {};

        for (let i in fields) {
            const key = fields[i];

            if (!values[key]) {
                return;
            }

            address[key] = values[key];
        }

        this.notif.info('Leter etter posisjon...', `Eiendom: ${values.address} ${values.addressNumber || ''}, ${values.postalCode} ${values.city}`);

        this.geocode.localize(address)
            .then((location) => {
                this.notif.remove();
                if (!location) {
                    const { address, addressNumber, postalCode, city } = values;
                    return this.notif.error(
                        'Klarte ikke å hente posisjon',
                        `Klarte ikkje å hente posisjonen til addressen ${address} ${addressNumber}, ${postalCode} ${city}`);
                }

                this.notif.success('Posisjon funnet', `Posisjonen er funnet ved lat: ${location.lat} og long: ${location.long}`);
                this.estate.location.lat = location.lat;
                this.estate.location.long = location.long;
            })
            .catch(err => this.notif.error('Klarte ikke å hente posisjon', err.message));
    }

    submit(values, valid) {
        if (!valid) {
            return this.notif.alert('Ugyldig skjema', 'Du mangler noen obligatoriske felt, og kan ikke lagre før desse er blitt fylt ut');
        }

        this.notif.info('Lagrer...', `Eiendom ved: ${values.address}`);

        this.es.save(this.concatEstate(this.estate, values))
            .subscribe((estate) => {
                this.updateForm(estate);
                this.notif.remove(); // Remove all previous notifications
                this.notif.success('Eiendom Lagret', `Eiendommen: ${estate.location.address} ble lagret`);
            }, err => this.notif.error('Kunne ikkje lagre eiendom', err.json().error));
    }

    /**
     * Manual function for concating form values with the existing estate
     * */
    concatEstate(estate: Estate, form) {
        const e = estate;
        e.size = form.size;
        e.description = form.description;
        e.url = form.url;

        e.location.address = form.address;
        e.location.addressNumber = form.addressNumber;
        e.location.postalCode = form.postalCode;
        e.location.city = form.city;

        return e;
    }

    updateForm(estate: Estate) {
        this.estate = estate;

        const { size, description, uploaded, url, location} = estate;
        const { address, addressNumber, postalCode, city } = location;

        this.form.patchValue({size, description, uploaded, url, address, addressNumber, postalCode, city});
    }
}