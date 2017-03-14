import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProjectsComponent } from "./projects/projects.component";
import { EstatesComponent } from "./estates/estates.component";
import { ErrorComponent } from "./error/error.component";

import { AuthGuard } from './shared/auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';

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
        path: 'admin',
        component: AdminComponent,
        canActivate: [ AuthGuard ] // Protects routes from unauthorized access
    },
    {
        path: 'admin/login',
        component: LoginComponent
    },
    { path: '**', component: ErrorComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}