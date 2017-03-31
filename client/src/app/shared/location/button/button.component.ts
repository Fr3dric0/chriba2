import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-location-button',
    templateUrl: './button.component.html'
})
export class LocationButtonComponent {
    @Output() localize: EventEmitter<any> = new EventEmitter();

    private _found: boolean;
    @Input()
    set found(found: boolean) {
        this._found = found;
    }
    get found(): boolean {
        return this._found;
    }

    private _disable: boolean;
    @Input()
    set disable(disable: boolean) {
        this._disable = disable;
    }
    get disable(): boolean {
        return this._disable;
    }

    send() {
        this.localize.emit(true);
    }
}