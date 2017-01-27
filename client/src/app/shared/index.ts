import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { XHRService } from './xhr.service';

export const SHARED_DECLARATIONS = [];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    XHRService
];