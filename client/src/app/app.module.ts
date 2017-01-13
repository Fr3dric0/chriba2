import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from "./app-routing.module";
import { ProjectsComponent } from './projects/projects.component';
import { EstatesComponent } from './estates/estates.component';
import { ERROR_DECLARATIONS, ERROR_SERVICES } from './error';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ProjectsComponent,
        EstatesComponent,
        ...ERROR_DECLARATIONS
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    providers: [
        ...ERROR_SERVICES
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
