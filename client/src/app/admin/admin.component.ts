import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { AdminService } from './admin.service';
import { Admin } from '../models/admin';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
    admin: Admin;

    constructor(private auth: AuthService,
                private adminService: AdminService) {}

    ngOnInit(): void {
        this.adminService.find()
            .subscribe(
                (adm) => this.admin = adm,
                (err) => console.error(err));


    }

    logout(): void {
        // TODO: init logout
    }
}