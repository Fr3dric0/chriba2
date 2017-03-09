import { ProjectService } from "./projects.service";
import { ProjectsComponent } from './projects.component';
import { ProjectsSubComponent } from './projects.sub_component';

export const PROJECTS_DECLARATIONS = [
  ProjectsComponent,
  ProjectsSubComponent
];

export const PROJECTS_PROVIDERS = [
  ProjectService,
];
