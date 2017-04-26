import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Angulartics2 } from 'angulartics2';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService,
                private angulartics2: Angulartics2) { }

    canActivate(): boolean {
        const authenticated = this.auth.authenticated();

        if (!authenticated) {
            this.angulartics2.eventTrack.next({
                action: 'AttemptedUnauthenticatedAccess',
                properties: { category: 'backdoor', label: '' }
            });
        }

        return authenticated; // Can only activate route if authenticated
    }
}