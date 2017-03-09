/**
 * Created by Ruben Johannessen on 02.03.2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'footer-address',
    templateUrl: './address.component.html',
    styleUrls: ['../footer-element.component.scss']
})
export class AddressComponent implements OnInit {

    address: string;
    addressNumber: string;
    postalCode: string;
    city: string;
    country: string;

    private _location;
    @Input()
    set location({address, addressNumber, postalCode, city, country}) {
        this.address = address;
        this.addressNumber = addressNumber;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
    }

    private _mailbox;
    @Input()
    set mailbox(mailbox) {
        this._mailbox = mailbox;
    }
    get mailbox() {
        return this._mailbox;
    }

    constructor() { }

    ngOnInit() {

    }
}
