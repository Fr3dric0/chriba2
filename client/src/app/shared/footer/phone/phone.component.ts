import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'footer-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {
    @Input() mobile: string;
    @Input() business: string;
    @Input() email: string;

    constructor() { }

    ngOnInit() {

    }

}