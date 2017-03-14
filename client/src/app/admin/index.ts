import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { GeneralFieldsComponent } from './general-fields/general-fields.component';
import { ProfileFieldsComponent } from './profile-fields/profile-fields.component';


export const ADMIN_DECLARATIONS = [
    AdminComponent,
    GeneralFieldsComponent,
    ProfileFieldsComponent
];

export const ADMIN_PROVIDERS = [
    AdminService
];