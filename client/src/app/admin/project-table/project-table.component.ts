import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { ProjectsService } from '../../projects/projects.service';
import { Project } from '../../models/project';

@Component({
    selector: 'app-project-field',
    templateUrl: './project-table.component.html',
    styleUrls: [ './project-table.component.scss' ]
})
export class ProfileTableComponent implements OnInit {

    projects: Project[];
    fields: any;

    constructor(private ps: ProjectsService,
                private notif: NotificationsService) {
    }

    ngOnInit() {
        this.ps.find()
            .subscribe(
                (projects) => {
                    this.projects = projects;
                    this.fields = this.createFields(projects);
                },
                err => this.notif.error('Project Loading Error', err.message)
            );
    }

    remove(id: string) {
        let project: Project = this.projects.filter(p => p.name === id)[ 0 ];

        if (!confirm(`Er du sikker på at du vil fjerne prosjektet '${project.title}'?`)) {
            return;
        }

        this.ps.remove(project)
            .subscribe(
                (status) => {
                    this.projects = this.projects.filter(p => p.name !== project.name);
                    this.fields = this.createFields(this.projects);
                    this.notif.success(`Prosjekt fjernet`, `${project.title} er fjernet`)
                },
                (err) => {
                    this.notif.error(`Fjerning av prosjekt feilet`, err.message)
                }
            )
    }

    private createFields(projects: Project[]) {
        return projects.map((project) => {
            let src = project.thumbnails.small.length > 0 ? project.thumbnails.small[ 0 ] : undefined;

            return {
                id: project.name,
                image: {
                    src,
                    alt: project.title
                },
                title: {
                    url: `/projects/${project.name}`,
                    label: `${project.title}`
                },
                description: project.description,
                modifiers: { edit: `/backdoor/projects/${project.name}` }
            };
        });
    }
}