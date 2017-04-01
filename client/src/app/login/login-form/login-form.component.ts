import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit{
    @Output() login = new EventEmitter();
    loginForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', <any>Validators.required],
            password: ['', [<any>Validators.required, <any>Validators.minLength(8)]]
        });
    }

    onLogin(values, valid): void {
        if (!valid) {
            console.error('Login input not valid');
            return;
        }

        this.login.emit(values);
    }
}