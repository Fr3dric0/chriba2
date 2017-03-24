import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { GeneralFieldsComponent } from './general-fields/general-fields.component';
import { ProfileFieldsComponent } from './profile-fields/profile-fields.component';
import { ProfileTableComponent } from './project-table/project-table.component';
import { EstateTableComponent } from './estate-table/estate-table.component';


export const ADMIN_DECLARATIONS = [
    AdminComponent,
    GeneralFieldsComponent,
    ProfileFieldsComponent,
    ProfileTableComponent,
    EstateTableComponent
];

export const ADMIN_PROVIDERS = [
    AdminService
];