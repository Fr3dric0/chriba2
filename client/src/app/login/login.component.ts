import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    constructor(private auth: AuthService,
                private router: Router) {}

    ngOnInit(): void {
        // Automatically redirect to admin if authenticated
        if (this.auth.authenticated()) {
            this.router.navigate(['/admin']);
        }
    }


    authenticate({email = '', password = ''}) {
        this.auth.authenticate(email, password)
            .then((success) => {
                this.router.navigate(['/admin']);
            })
            .catch( err => console.error(err));
    }
}