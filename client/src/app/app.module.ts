import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

///////////////////////////////////////
//         Project modules           //
///////////////////////////////////////
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from "./app-routing.module";
import { PROJECTS_DECLARATIONS, PROJECTS_PROVIDERS } from './projects';
import { ESTATES_DECLARATIONS, ESTATES_PROVIDERS } from './estates';
import { ERROR_DECLARATIONS } from './error';
import { SHARED_DECLARATIONS, SHARED_PROVIDERS } from './shared';
import { ADMIN_DECLARATIONS, ADMIN_PROVIDERS } from './admin';
import { DETAILS_DECLARATIONS } from "./details";
import { LOGIN_DECLARATIONS, LOGIN_PROVIDERS } from './login';

///////////////////////////////////////
//         3rd party modules         //
///////////////////////////////////////
import { AgmCoreModule } from '@agm/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ...PROJECTS_DECLARATIONS,
        ...ESTATES_DECLARATIONS,
        ...ERROR_DECLARATIONS,
        ...SHARED_DECLARATIONS,
        ...ADMIN_DECLARATIONS,
        ...DETAILS_DECLARATIONS,
        ...LOGIN_DECLARATIONS
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC8x1S79lhHlDOBgqj1q0kFB6DxCSw8YjU'
        }),
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
        SimpleNotificationsModule.forRoot()
    ],
    providers: [
        ...SHARED_PROVIDERS,
        ...ADMIN_PROVIDERS,
        ...ESTATES_PROVIDERS,
        ...PROJECTS_PROVIDERS,
        ...LOGIN_PROVIDERS
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
