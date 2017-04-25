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

    addClickListener(): void {
      document.addEventListener('click', this.offClickHandler.bind(this));
      console.log('listening');
    }

    removeClickListener(): void {
      document.removeEventListener('click', this.offClickHandler.bind(this));
      console.log('not listening');
    }

    toggleMenu(): void {
        this.expanded = !this.expanded;

        if (this.expanded) {
          console.log('expanded!');
          setTimeout(this.addClickListener, 1);

        } else {
          console.log('closed!');
          setTimeout(this.removeClickListener, 1);
        }
    }

    offClickHandler(event:any) {
      console.log('click registered!');
      this.toggleMenu();
    }

    scrollToElement(element): void {
      document.querySelector(element).scrollIntoView();
    }

}
