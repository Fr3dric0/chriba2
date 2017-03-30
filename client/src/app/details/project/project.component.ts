/**
 * Created by Ruben Johannessen on 15.03.2017.
 */
import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'details-project',
    templateUrl: './project.component.html',
    styleUrls: ['../subdetails.component.scss']
})
export class ProjectComponent implements OnInit {

    private name: string;
    private title: string;
    private description: string;
    private url: string;

    @Input()
    set data({name, title, description, url}) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.url = url;
    }

    constructor() { }

    ngOnInit() { }
}