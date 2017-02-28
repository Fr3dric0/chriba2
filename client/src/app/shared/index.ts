import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { XHRService } from './xhr.service';
import { GeneralService } from './general/general.service'
import { ThumbnailService } from "./general/thumbnails.service";
import { ProjectService } from "../projects/projects.service";
import { EstateService } from "../estates/estates.service";

export const SHARED_DECLARATIONS = [];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    GeneralService,
    ThumbnailService,
    ProjectService,
    EstateService,
    XHRService
];
