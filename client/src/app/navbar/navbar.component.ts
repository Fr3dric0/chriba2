import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { NavbarService } from './navbar.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    providers: [ Location, {provide: LocationStrategy, useClass: PathLocationStrategy} ],
})
export class NavbarComponent implements OnInit {
    constructor(private navbarService: NavbarService, location: Location) {
        this.location = location;
    }

    navbarElems: [{ route: string, name: string }];
    location: Location;

    getNavbarElems(): void {
        this.navbarElems = this.navbarService.getNavbarElems();
    }

    ngOnInit(): void {
        this.getNavbarElems();
    }
}
