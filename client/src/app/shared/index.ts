import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { ItemListComponent } from './item-list/item-list.component';
import { GeneralService } from './general/general.service'

export const SHARED_DECLARATIONS = [
    ItemListComponent
];

export const SHARED_PROVIDERS = [
    AuthService,
    AuthGuard,
    GeneralService
];
