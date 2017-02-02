import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { GeneralService } from './general/general.service'
import {ProjectsService} from "./general/projects.service";
import {EstatesService} from "./general/estates.service";

export const SHARED_DECLARATIONS = [];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    GeneralService,
    ProjectsService,
    EstatesService
];
