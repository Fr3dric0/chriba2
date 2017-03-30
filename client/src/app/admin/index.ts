import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { GeneralFieldsComponent } from './general-fields/general-fields.component';
import { ProfileFieldsComponent } from './profile-fields/profile-fields.component';
import { ProfileTableComponent } from './project-table/project-table.component';
import { EstateTableComponent } from './estate-table/estate-table.component';
import { EstateHandlerComponent } from './estate-handler/estate-handler.component';
import { ProjectHandlerComponent } from './project-handler/project-handler.component';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';


export const ADMIN_DECLARATIONS = [
    AdminComponent,
    GeneralFieldsComponent,
    ProfileFieldsComponent,
    ProfileTableComponent,
    EstateTableComponent,

    EstateHandlerComponent,
    ProjectHandlerComponent,
    ThumbnailComponent
];

export const ADMIN_PROVIDERS = [
    AdminService
];