import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { MapComponent } from "./map/map.component";

export const SHARED_DECLARATIONS = [
    MapComponent
];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard
];
