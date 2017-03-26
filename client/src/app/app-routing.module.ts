import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProjectsComponent } from "./projects/projects.component";
import { EstatesComponent } from "./estates/estates.component";
import { ErrorComponent } from "./error/error.component";

import { AuthGuard } from './shared/auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { EstateHandlerComponent } from './admin/estate-handler/estate-handler.component';

const routes:Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'projects',
        component: ProjectsComponent
    },
    {
        path: 'estates',
        component: EstatesComponent
    },
    {
        // Uses backdoor instead of 'admin' to fuck with automated
        // bots.
        path: 'backdoor',
        component: AdminComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: 'backdoor/login',
        component: LoginComponent
    },
    {
        path: 'backdoor/estates',
        component: EstateHandlerComponent
    },
    {
        path: 'backdoor/estates/:name',
        component: EstateHandlerComponent
    },
    { path: '**', component: ErrorComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}