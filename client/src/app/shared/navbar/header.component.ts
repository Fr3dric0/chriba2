import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { headerLinks, Link } from './header-links';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [ Location, {provide: LocationStrategy, useClass: PathLocationStrategy} ],
})
export class HeaderComponent {
    routes: Link[] = headerLinks;
    location: Location;

    expanded: boolean = false;

    constructor(private loc: Location) {
        this.location = loc;
    }

    toggleMenu(): void {
        this.expanded = !this.expanded;
    }
}
