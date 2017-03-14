import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router) { }

    canActivate(): boolean {
        let authenticated = this.auth.authenticated();

        if (!authenticated) {
            this.router.navigate(['/admin/login']);
        }

        return authenticated; // Can ativate if authenticated
    }
}