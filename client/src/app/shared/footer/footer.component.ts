/**
 * Created by Ruben Johannessen on 08.02.2017.
 */
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../general/general.service';
import { FooterRelayService } from "./footer-relay.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit{
    public business: string;
    public email: string;
    public location: any = {address: '', addressNumber: '', postalCode: '', city: '', country: ''};
    public mailbox: string;
    public mobile: string;
    public lat: number;
    public long: number;

    blur: boolean = false;
    
    constructor(private generalService: GeneralService,
                private footerRelay: FooterRelayService) { }

    ngOnInit(){
        this.footerRelay.toggleBlur.subscribe((blur) => {
          this.blur = blur;
        });
      
        const sub = this.generalService.find()
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
