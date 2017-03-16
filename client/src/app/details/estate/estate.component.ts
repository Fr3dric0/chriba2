/**
 * Created by Ruben Johannessen on 15.03.2017.
 */
import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'details-estate',
    templateUrl: './estate.component.html',
    styleUrls: ['../details.component.scss']
})
export class EstateComponent implements OnInit {

    private name: string;
    private description: string;
    private size: number;
    private url: string;
    private location: any;

    @Input()
    set data({name, description, size, url, location}) {
        this.name = name;
        this.description = description;
        this.size = size;
        this.url = url;
        this.location = location;
    }

    constructor() { }

    ngOnInit() { }
}