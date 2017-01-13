import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProjectsComponent } from "./projects/projects.component";
import { EstatesComponent } from "./estates/estates.component";
import { ErrorComponent } from "./error/error.component";


/**
 * The routing is similar to ExpressJS's routes.
 * Each path has it's own object with the 'path', and the responsible 'compoenent'
 * If you need to include route-params. you just include ':<name of var>' in the route.
 * */
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
        path: 'error',
        component: ErrorComponent
    },
    {
        path: 'error/:code', // THe error component has an optional route-param
        component: ErrorComponent
    },
    { path: '**', redirectTo: 'error/404' } // Redirect to 404 error component
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}