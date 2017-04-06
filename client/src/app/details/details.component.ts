import { Component, OnInit } from '@angular/core';
import { EstatesService } from "../estates/estates.service";
import { ProjectsService } from "../projects/projects.service";

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    private isEstate: boolean = false;
    private name: any;
    private data: any;

    constructor(private es: EstatesService,
                private ps: ProjectsService) { }

    ngOnInit() {
        this.name = location.pathname.substring(1).split("/");

        if (this.name[0] == "estates") {
            const sub = this.es.findOne(this.name[1])
                .subscribe((data) => {
                    this.data = data;

                    sub.unsubscribe();
                },
                err => console.error(err));

            this.isEstate = true;

        } else if (this.name[0] == "projects") {
            const sub = this.ps.findOne(this.name[1])
                .subscribe((data) => {
                    this.data = data;

                    sub.unsubscribe();
                },
                err => console.error(err));
        }
    }
}