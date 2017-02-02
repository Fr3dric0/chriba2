import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { GeneralService } from './general/general.service'

export const SHARED_DECLARATIONS = [];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    GeneralService
];
