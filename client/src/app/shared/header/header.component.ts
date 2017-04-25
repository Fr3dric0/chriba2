import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AuthService } from '../auth/auth.service';

export const headerLinks: Link[] =  [
  {label: 'prosjekter', route: '/projects'},
  {label: 'eiendommer', route: '/estates'}
];

export interface Link {
  label?: string;
  route: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [ Location, {provide: LocationStrategy, useClass: PathLocationStrategy} ],
})
export class HeaderComponent implements OnInit{
    routes: Link[] = headerLinks;
    location: Location;

    expanded: boolean = false;

    authenticated: boolean = false;

    constructor(private loc: Location, private auth: AuthService) {
        this.location = loc;
    }

    ngOnInit() {
        // Tracks if the user is authenticated or not
        this.auth.authStatus.subscribe((authenticated) => this.authenticated = authenticated);
    }

    toggleMenu(): void {
        this.expanded = !this.expanded;
    }

    scrollToElement(element): void {
      document.querySelector(element).scrollIntoView();
    }

}
