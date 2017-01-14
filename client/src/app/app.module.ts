import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from "./app-routing.module";
import { ProjectsComponent } from './projects/projects.component';
import { EstatesComponent } from './estates/estates.component';
import { ERROR_DECLARATIONS } from './error';
import { SHARED_DECLARATIONS, SHARED_PROVIDERS } from './shared';
import { ADMIN_DECLARATIONS, ADMIN_PROVIDERS } from './admin/index';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ProjectsComponent,
        EstatesComponent,
        ...ERROR_DECLARATIONS,
        ...SHARED_DECLARATIONS,
        ...ADMIN_DECLARATIONS
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    providers: [
        ...SHARED_PROVIDERS,
        ...ADMIN_PROVIDERS
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
