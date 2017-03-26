import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-content-table',
    templateUrl: './content-table.component.html',
    styleUrls: ['./content-table.component.scss']
})
export class ContentTableComponent {
    @Output() remove: EventEmitter<any> = new EventEmitter();

    private _headers: string[];
    @Input()
    set headers(headers: string[]) {
        this._headers = this.fillHeaders(headers);
    }
    get headers(): string[] {
        return this._headers;
    }

    private _fields: {
        id: any,
        image: {src: string, alt: string },
        title: { url: string, label: string },
        description: string,
        modifiers: { edit: string }
    };

    @Input()
    set fields(fields: any) {
        this._fields = fields;
    }
    get fields(): any {
        return this._fields;
    }

    private _create: {url: string, label: string};
    @Input()
    set create(create: any) {
        this._create = create;
    }
    get create(): any {
        return this._create;
    }

    /**
     * We expect the table headers
     * to be of length 4
     * */
    private fillHeaders(headers: string[]) {
        let h = ['', '', '', ''];

        for (let i = 0; i < h.length; i++) {
            if (i > headers.length) {
                break;
            }

            h[i] = headers[i];
        }

        return h;
    }

    onRemove(id: any) {
        this.remove.emit(id);
    }
}