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
            // Do some rerouting
            //this.router.navigate(['']);
        }

        return authenticated; // Can ativate if authenticated
    }
}