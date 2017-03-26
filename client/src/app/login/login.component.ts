import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    constructor(private auth: AuthService,
                private router: Router,
                private notif: NotificationsService) {}

    ngOnInit(): void {
        // Automatically redirect to admin if authenticated
        if (this.auth.authenticated()) {
            this.router.navigate(['/backdoor']);
        }
    }


    authenticate({email = '', password = ''}) {
        this.notif.info('Logger inn', `Bruker: ${email}`);

        this.auth.authenticate(email, password)
            .then((success) => {
                this.notif.remove();
                this.router.navigate(['/backdoor']);
            })
            .catch( err => {
                this.notif.remove();
                switch (err.status) {
                    case 400:
                        this.notif.error('Ugyldig skjema', 'Mangler epost eller passord');
                        break;
                    case 403:
                    case 401:
                        this.notif.error('Uautentisert', 'Epost eller passord er feil');
                        break;

                    default:
                        this.notif.error('Ukjent feil', err.json().error);
                }
            });
    }
}