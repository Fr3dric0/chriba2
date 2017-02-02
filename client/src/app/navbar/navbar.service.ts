import { Injectable } from '@angular/core';

@Injectable()
export class NavbarService {
    getNavbarElems(): [{route: string, name: string}] {
        return [
            {route: "/projects", name: "Prosjekter"},
            {route: "/estates", name: "Eiendommer"},
            {route: "#footer", name: "Kontakt oss"},
               ];
    }
}
