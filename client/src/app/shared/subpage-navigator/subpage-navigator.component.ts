import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-subpage-navigator',
    templateUrl: './subpage-navigator.component.html',
    styleUrls: ['./subpage-navigator.component.scss']
})
export class SubpageNavigatorComponent {

    private _back: string;
    @Input()
    set back(back:string) {
        this._back = back;
    }
    get back(): string {
        return this._back;
    }

}