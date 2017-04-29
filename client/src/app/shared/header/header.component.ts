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

    boundOffClickHandler: any = this.offClickHandler.bind(this);

    constructor(private loc: Location, private auth: AuthService) {
        this.location = loc;
    }

    ngOnInit() {
        // Tracks if the user is authenticated or not
        this.auth.authStatus.subscribe((authenticated) => this.authenticated = authenticated);
    }

  /**
   * Toggles the expanded view of the hamburger menu. when the menu is expanded, an eventListener is added to document
   * to register clicks, so that the menu can be automatically collapsed when a user clicks outside it.
   * This eventListener is removed when the menu is collapsed, to not waste resources.
   */
  toggleMenu(): void {
        this.expanded = !this.expanded;

        if (this.expanded) {
          this.scrollToElement('header');
          setTimeout(()=>{
            document.addEventListener('click', this.boundOffClickHandler);
          },1);

        } else {
          setTimeout(()=>{
            document.removeEventListener('click', this.boundOffClickHandler);
          },1);
        }
    }

  /**
   * This function makes sure that the hamburger menu will collapse if a click anywhere on the page is registered
   * when the menu is open. Clicks on the 'hamburger-menu' button are ignored, as that button is already mapped to
   * toggle the menu.
   * @param evt
   */
  offClickHandler(evt: any) {
      if (!evt.target.className.includes('hamburger-menu')){
        this.toggleMenu();
      }
    }

    scrollToElement(element): void {
      document.querySelector(element).scrollIntoView();
    }

}
