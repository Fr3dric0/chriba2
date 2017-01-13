import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProjectsComponent } from "./projects/projects.component";
import { EstatesComponent } from "./estates/estates.component";
import { ErrorComponent } from "./error/error.component";


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
    { path: '**', component: ErrorComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}