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
  business: string;
  email: string;
  address: string;
  addressNumber: string;
  city: string;
  country: string;
  postalCode: string;
  mailbox: string;
  mobile: string;


  constructor(private generalService: GeneralService) { }

  ngOnInit(){
      const sub = this.generalService.getAbout()
        .subscribe((data) => {
          this.business = data.business;
          this.email = data.email;
          this.address = data.location.address;
          this.addressNumber = data.location.addressNumber;
          this.city = data.location.city;
          this.country = data.location.country;
          this.postalCode = data.location.postalCode;
          this.mailbox = data.mailbox;
          this.mobile = data.mobile;

          sub.unsubscribe();
          console.log(data);
        },
        err => console.error(err));
  }
}
