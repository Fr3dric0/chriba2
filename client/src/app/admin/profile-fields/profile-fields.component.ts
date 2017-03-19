import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { AdminService } from '../admin.service';
import { Admin } from '../../models/admin';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-profile-fields',
    templateUrl: './profile-fields.component.html',
    styleUrls: ['./profile-fields.component.scss']
})
export class ProfileFieldsComponent implements OnInit {
    form: FormGroup;

    _admin: Admin;
    @Input()
    set admin(admin: Admin) {
        this._admin = admin;
        this.updateForm(admin);
    }
    get admin(): Admin { return this._admin; }

    @Output() save = new EventEmitter<any>();   // AdminComponent has the responsebility of forwarding the information/
                                                // Therefore, will we only forward the updated values

    constructor(private fb: FormBuilder,
                private notif: NotificationsService) { }

    ngOnInit() {
        // Init form
        this.form = this.fb.group({
            firstName: ['', [<any>Validators.required]],
            lastName: ['', [<any>Validators.required]],
            email: ['', [<any>Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
            oldPassword: [null, []],
            password: [null, [<any>Validators.minLength(8)]],
            confirmPassword: [null, [<any>Validators.minLength(8)]]
        });

    }

    submit(data, valid): void {
        if (!valid) {
            this.notif.alert('Invalid Form Value', 'Your form has some invalid values, and cannot save the updates yet');
            return;
        }

        this.save.emit(data);
    }

    private updateForm(admin: Admin): void {
        if (!admin) {
            return;
        }
        const { firstName, lastName, email } = admin;
        this.form.patchValue({ firstName, lastName, email });
    }

}