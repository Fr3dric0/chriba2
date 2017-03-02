/**
 * Created by Ruben Johannessen on 08.02.2017.
 */
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../general/general.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit{
    public business: string;
    public email: string;
    public location: any = {address: '', addressNumbe: '', postalCode: '', city: '', country: ''};
    public mailbox: string;
    public mobile: string;
    public lat: number;
    public long: number;

    constructor(private generalService: GeneralService) { }

    ngOnInit(){
        const sub = this.generalService.getAbout()
            .subscribe((data) => {
                    this.business = data.business;
                    this.email = data.email;
                    this.location = data.location;
                    this.mailbox = data.mailbox;
                    this.mobile = data.mobile;
                    this.lat = data.location.lat;
                    this.long = data.location.long;

                    sub.unsubscribe();
                },
                err => console.error(err));
    }
}