import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { AdminService } from './admin.service';
import { Admin } from '../models/admin';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    admin: Admin;

    constructor(private auth: AuthService,
                private adminService: AdminService,
                private router: Router,
                private notif: NotificationsService) {}

    ngOnInit(): void {
        this.adminService.find()
            .subscribe(
                (adm) => this.admin = adm,
                (err) => this.notif.error(
                    'Profile Loading Error',
                    err.code < 502 ? err.json().error : err.json()));
    }

    logout(): void {
        this.auth.logout();

        setTimeout(() => {
            this.notif.remove();
            this.router.navigate(['']);
        }, 1000);

        this.notif.success('Utlogget', 'Sendes tilbake til fremsiden...');
    }

    saveProfile(admin): void {
        this.notif.info('Oppdaterer...', 'Oppdaterer profil');

        this.adminService.save(admin)
            .subscribe((admin) => {
                this.admin = admin;
                this.notif.success(
                    'Profil oppdatert',
                    'Vi har nå'
                );
            }, err => this.notif.error(
                'Profile Update Error',
                err.json().error || err.json()));
    }
}