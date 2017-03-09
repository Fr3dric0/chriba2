import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { XHRService } from './xhr.service';
import { GeneralService } from './general/general.service'
import { ThumbnailService } from "./general/thumbnails.service";
import { ProjectService } from "../projects/projects.service";
import { EstateService } from "../estates/estates.service";
import { CarouselComponent } from "./carousel/carousel.component";
// import { MapComponent } from "./map/map.component";
// import { FooterComponent } from "./footer/footer.component";
// import { AddressComponent } from "./footer/address/address.component";
// import { PhoneComponent } from  "./footer/phone/phone.component";

export const SHARED_DECLARATIONS = [
  CarouselComponent,
  //FooterComponent,
  //AddressComponent,
  //PhoneComponent,
  //MapComponent
];

export const SHARED_PROVIDERS = [
  AuthService,
  AuthGuard,
  GeneralService,
  ThumbnailService,
  ProjectService,
  EstateService,
  XHRService
];

