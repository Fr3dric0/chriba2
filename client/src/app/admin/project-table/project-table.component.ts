import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { ProjectsService } from '../../projects/projects.service';
import { Project } from '../../models/project';

@Component({
    selector: 'app-project-field',
    templateUrl: './project-table.component.html',
    styleUrls: ['./project-table.component.scss']
})
export class ProfileTableComponent implements OnInit {

    projects: Project[];


    constructor (private ps: ProjectsService,
                private notif: NotificationsService) { }

    ngOnInit() {

        this.ps.find()
            .subscribe(
                projects => this.projects = projects,
                err => this.notif.error('Project Loading Error', err.message)
            );
    }

    remove(project: Project) {
        this.ps.remove(project)
            .subscribe(
                (status) => {
                    this.projects = this.projects.filter( p => p.name !== project.name);

                    this.notif.success(`Prosjekt fjernet`, `${project.title} er fjernet`)
                },
                (err) => {
                    this.notif.error(`Fjerning av prosjekt feilet`, err.message)
                }
            )
    }
}