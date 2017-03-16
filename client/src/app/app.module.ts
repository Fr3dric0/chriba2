import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from "./app-routing.module";
import { PROJECTS_DECLARATIONS, PROJECTS_PROVIDERS } from './projects';
import { ESTATES_DECLARATIONS, ESTATES_PROVIDERS } from './estates';
import { ERROR_DECLARATIONS } from './error';
import { SHARED_DECLARATIONS, SHARED_PROVIDERS } from './shared';
import { ADMIN_DECLARATIONS, ADMIN_PROVIDERS } from './admin';
import { DETAILS_DECLARATIONS } from "./details";

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ...PROJECTS_DECLARATIONS,
        ...ESTATES_DECLARATIONS,
        ...ERROR_DECLARATIONS,
        ...SHARED_DECLARATIONS,
        ...ADMIN_DECLARATIONS,
        ...DETAILS_DECLARATIONS
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC8x1S79lhHlDOBgqj1q0kFB6DxCSw8YjU'
        })
    ],
    providers: [
        ...SHARED_PROVIDERS,
        ...ADMIN_PROVIDERS,
        ...ESTATES_PROVIDERS,
        ...PROJECTS_PROVIDERS,
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
