import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { AdminService } from '../admin.service';
import { Admin } from '../../models/admin';

@Component({
    selector: 'app-profile-fields',
    templateUrl: './profile-fields.component.html',
    styleUrls: ['./profile-fields.component.scss']
})
export class ProfileFieldsComponent implements OnInit {
    form: FormGroup;

    constructor(private as: AdminService,
                private fb: FormBuilder) {

    }

    ngOnInit() {
        // Init form
        this.form = this.fb.group({
            firstName: ['', [<any>Validators.required]],x
            lastName: ['', [<any>Validators.required]],
            email: ['', [<any>Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
            oldPassword: ['', [<any>Validators.minLength(8)]],
            password: ['', [<any>Validators.minLength(8)]],
            confirmPassword: ['', [<any>Validators.minLength(8)]]
        });

        this.as.find()
            .subscribe((admin:Admin) => {

            }, (err) => console.)
    }

    save(data, valid): void {
        if (!valid) {
            return console.log("General form has invalid values");
        }

    }

    private updateForm(): void {
        this.form.patchValue({});
    }

}