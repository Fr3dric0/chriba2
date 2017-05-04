import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { About } from '../../models/about';
import { AuthService } from '../auth/auth.service';
import { CRUDService } from '../crud.service';

@Injectable()
export class GeneralService extends CRUDService<About> {
    constructor(protected http: Http,
                private auth: AuthService) {
        super(http);

        this.usePatch = true;
        this.path = '/api/general';
        this.token = this.auth.getToken();
    }
}