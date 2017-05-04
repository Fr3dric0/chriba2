import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProjectsComponent } from "./projects/projects.component";
import { EstatesComponent } from "./estates/estates.component";
import { ErrorComponent } from "./error/error.component";
import { DetailsComponent } from "./details/details.component";

import { AuthGuard } from './shared/auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { EstateHandlerComponent } from './admin/estate-handler/estate-handler.component';
import { ProjectHandlerComponent } from './admin/project-handler/project-handler.component';

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
        path: 'projects/:name',
        component: DetailsComponent
    },
    {
        path: 'estates',
        component: EstatesComponent
    },
    {
        path: 'estates/:name',
        component: DetailsComponent
    },
    {
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
        component: EstateHandlerComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: 'backdoor/estates/:name',
        component: EstateHandlerComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: 'backdoor/projects',
        component: ProjectHandlerComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: 'backdoor/projects/:name',
        component: ProjectHandlerComponent,
        canActivate: [ AuthGuard ]
    },
    { path: '**', component: ErrorComponent }
];


@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}