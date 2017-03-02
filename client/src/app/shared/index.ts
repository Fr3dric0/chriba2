import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { MapComponent } from "./map/map.component";
import { GeneralService } from './general/general.service';
import { FooterComponent } from "./footer/footer.component";

export const SHARED_DECLARATIONS = [
  FooterComponent,
  MapComponent
];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    GeneralService
];
