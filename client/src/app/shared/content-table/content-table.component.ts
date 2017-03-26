import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-content-table',
    templateUrl: './content-table.component.html',
    styleUrls: ['./content-table.component.scss']
})
export class ContentTableComponent {

    private _headers: string[];
    @Input()
    set headers(headers: string[]) {

    }
    get headers(): string[] {
        return this._headers;
    }

}