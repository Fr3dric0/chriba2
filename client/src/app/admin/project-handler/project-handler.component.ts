import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { EstatesService } from '../../estates/estates.service';
import { Estate } from '../../models/estate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeocodeService } from '../../shared/map/geocode.service';
import { ProjectsService } from '../../projects/projects.service';
import { Project } from '../../models/project';
import { ChribaTitleService } from '../../shared/chriba-title.service';

@Component({
    selector: 'app-admin-project-handler',
    templateUrl: './project-handler.component.html',
    styleUrls: ['./project-handler.component.scss']
})
export class ProjectHandlerComponent implements OnInit {
    project: Project = {title: null};
    form: FormGroup;
    name: string;
    saved: boolean = false;

    constructor(private ps: ProjectsService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private notif: NotificationsService,
                private titleService: ChribaTitleService) {
    }

    ngOnInit() {
        this.titleService.setTitle('Admin Prosjekt');

        this.form = this.fb.group({
            title: [null, <any>Validators.required],
            description: [null],
            uploaded: [null],
            url: [null]
        });

        // Check if admin wants to modify existing project,
        // by providing an optional 'name' parameter
        this.route.params.subscribe((params: Params) => {
            const {name} = params;

            if (!name) {
                return;
            }

            this.ps.findOne(name).subscribe(
                (project) => {
                    if (!project) {
                        return this.notif.alert('Fant ikke prosjekt', `Fant ikke prosjekt: ${name}`);
                    }

                    this.updateForm(project);
                },
                err => this.notif.error('Klarte ikke å hente prosjekt', `${err.json().error}${err.json().description}`));

            this.name = name;
        })
    }


    submit(values, valid) {
        if (!valid) {
            return this.notif.alert('Ugyldig skjema', 'Du mangler noen obligatoriske felt, og kan ikke lagre før de er blitt fylt ut');
        }

        this.notif.info('Lagrer...', `Eiendom ved: ${values.address}`);

        this.ps.save(this.concatProject(this.project, values))
            .subscribe((project) => {
                this.updateForm(project);
                this.saved = true;
                this.notif.remove(); // Remove all previous notifications
                this.notif.success('Prosjekt Lagret', `Prosjekt: ${project.title} ble lagret`);

            }, (err) => {
                this.saved = false;
                this.notif.error('Kunne ikke lagre prosjekt', `${err.json().error}${err.json().description}`);
            });
    }

    upload(form) {
        if (!form || !form.thumb || !form.thumb.value) {
            this.notif.alert(`Bildet mangler`, 'Det ser ikke ut som at du har lagt til noe bilde for opplasting');
            return;
        }

        // Add a simple warning for some large files
        if (form.thumb.value.endsWith('.mp4') || form.thumb.value.endsWith('.mkv')) {
            this.notif.alert('Obs. Mulig ulovlig filtype', 'Mulig videofiler er for store for siden');
        }

        this.notif.info('Laster opp', `fil: ${form.thumb.value}`);

        this.ps.uploadThumb(form, this.project)
            .then((project) => {
                this.notif.remove();
                this.project = project;
                this.notif.success(`opplastet`, `Bildet vart lastet opp`);
            })
            .catch((err) => {
                this.notif.remove();
                this.notif.error(`Kunne ikke laste opp bildet`, err);
            });
    }

    remove(data: {index, size}) {
        if (data.index < 0) {
            return this.notif.alert('Ugyldig bilde', 'Ser ut som at bildet du valgte ikke finnes');
        }

        this.ps.removeThumb(data.size, data.index, this.project)
            .subscribe((project) => {
                this.project = project;
                this.notif.success(`Bilde fjernet`, 'Bildet er blitt fjernet');
            }, (err) => {
                this.notif.error('Kunne ikke fjerne bilde', err.json().error);
            });
    }

    /**
     * Manual function for concating form values with the existing projects
     * */
    concatProject(project: Project, form) {
        const p = project; // Use the stores project as base, to keep the fields 'name' and '_id'
        p.title = form.title;
        p.description = form.description;
        p.url = form.url;

        return p;
    }

    updateForm(project: Project) {
        this.project = project;
        this.form.patchValue(project);
    }
}
