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
    estate: Estate = {_id: null, location: {address: ''}};
    form: FormGroup;
    name: string;
    saved: boolean = false;

    constructor(private es: EstatesService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private geocode: GeocodeService,
                private notif: NotificationsService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            description: [null],
            size: [null],
            location: this.fb.group({
                address: [null, <any>Validators.required],
                addressNumber: [null],
                postalCode: [null],
                city: [null]
            }),
            uploaded: [null],
            url: [null]
        });

        this.route.params.subscribe((params: Params) => {
            const {name} = params;

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

    /**
     * @param   {object}    values   Object with the fields {address, addressNumber, postalCode, city}
     *
     * Based on the 'address', 'addressNumber',
     * 'postalCode' and 'city', tries to locate the coordinates for
     * the object
     * */
    localize(values) {
        if (!values.location) {
            return;
        }

        this.notif.info(
            'Leter etter posisjon...',
            `Eiendom: ${values.location.address} ${values.location.addressNumber || ''}, ${values.location.postalCode} ${values.location.city}`
        );

        this.geocode.localize(values.location)
            .then((location) => {
                this.notif.remove();
                if (!location) {
                    const {address, addressNumber, postalCode, city} = values.location;
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

    /**
     * @param   {Estate}    values  Estate values from the form
     * @param   {boolean}   valid   Valid if the form is valid
     *
     * Saves the updated values to the databse
     * */
    submit(values, valid) {
        if (!valid) {
            return this.notif.alert('Ugyldig skjema', 'Du mangler noen obligatoriske felt, og kan ikke lagre før desse er blitt fylt ut');
        }

        this.notif.info('Lagrer...', `Eiendom ved: ${values.location.address}`);

        this.es.save(this.concatEstate(this.estate, values))
            .subscribe((estate) => {
                this.updateForm(estate);

                this.saved = true;

                this.notif.remove(); // Remove all previous notifications
                this.notif.success('Eiendom Lagret', `Eiendommen: ${estate.location.address} ble lagret`);
            }, (err) => {
                this.notif.error('Kunne ikkje lagre eiendom', err.json().error);
                this.saved = false;
            });
    }

    /**
     * @param   {Form}  form    Regular DOM Form
     *
     * Requires the form to contain 'thumb' and 'size'.
     * Uploads the thumbnail to the server
     * */
    upload(form) {
        if (!form || !form.thumb || !form.thumb.value) {
            this.notif.alert(`Bildet mangler`, 'Det ser ikke ut som at du har lagt til noe bilde for opplasting');
            return;
        }

        this.es.uploadThumb(form, this.estate)
            .then((estate) => {
                // Prevent loss of coordinations
                const { lat, long } = this.estate.location;
                this.estate = estate;
                this.estate.location.lat = lat;
                this.estate.location.long = long;
                this.notif.success(`opplastet`, `Bildet vart lastet opp`);
            })
            .catch((err) => this.notif.error(`Kunne ikke laste opp bildet`, err));
    }

    /**
     * @param   {Object}    data    Contains {index, size}
     * The `index` points to the position of the image, and the
     * `size` points to the thumbnail-list where the image is stored.
     * */
    remove(data) {
        if (data.index < 0) {
            return this.notif.alert('Ugyldig bilde', 'Ser ut som at bildet du valgte ikke finst');
        }

        this.es.removeThumb(data.size, data.index, this.estate)
            .subscribe((estate) => {
                this.estate = estate;
                this.notif.success(`Bilde fjernet`, 'Bildet er blitt fjernet');
            }, (err) => {
                this.notif.error('Kunne ikke fjerne bilde', err.json().error);
            });
    }

    /**
     * Manual function for concating form values with the existing estate
     * */
    private concatEstate(estate: Estate, form) {
        const {lat, long} = estate.location;
        const {name, _id} = estate;

        const e = form;

        // Add lost values
        e.name = name;
        e._id = _id;
        e.location.lat = lat;
        e.location.long = long;

        return e;
    }

    updateForm(estate: Estate) {
        this.estate = estate;

        this.form.patchValue(estate);
    }
}