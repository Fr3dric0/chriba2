import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { XHRService } from './xhr.service';
import { GeneralService } from './general/general.service'
import { ThumbnailService } from "./general/thumbnails.service";
import { ProjectsService } from "../projects/projects.service";
import { EstatesService } from "../estates/estates.service";

import { MapComponent } from "./map/map.component";
import { FooterComponent } from "./footer/footer.component";
import { AddressComponent } from "./footer/address/address.component";
import { PhoneComponent } from  "./footer/phone/phone.component";
import { HeaderComponent } from './navbar/header.component';

import { GeocodeService } from './map/geocode.service';
import { ContentTableComponent } from './content-table/content-table.component';

export const SHARED_DECLARATIONS = [
    HeaderComponent,
    FooterComponent,
    AddressComponent,
    PhoneComponent,
    MapComponent,
    ContentTableComponent
];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    GeneralService,
    ThumbnailService,
    ProjectsService,
    EstatesService,
    XHRService,
    GeocodeService
];

