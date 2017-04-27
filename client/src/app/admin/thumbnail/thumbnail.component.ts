import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-admin-thumbnail-handler',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent {
    size;
    filename: string;

    // N.B. Got a strange double emittion of the event,
    // if the EventEmitter was called 'submit' and not 'upload'
    @Output() upload: EventEmitter<any> = new EventEmitter();
    @Output() remove: EventEmitter<{size: string, index: number}> = new EventEmitter();

    private _element: { thumbnails: {small: string[], large: string[]}};
    @Input()
    set element(element) {
        this._element  = element;
    }
    get element() {
        return this._element;
    }

    submit(evt) {
        this.upload.emit(evt.target);
        this.filename = null;
        evt.target.reset(); // Assures fileChange will trigger
    }

    fileChange(evt) {
        const f = evt.target.value.split('\\');
        this.filename = f[f.length - 1]; // Keep only the filename
    }

    rmv(size: string, item) {
        const index = this.element.thumbnails[size].indexOf(item);
        this.remove.emit({size, index});
    }
}