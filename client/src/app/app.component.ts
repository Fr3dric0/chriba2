import { Component, OnInit } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { FooterRelayService } from "./shared/footer/footer-relay.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
    blurFooter: boolean;
  
    constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                private footerRelay: FooterRelayService) {}

    ngOnInit() {
      this.footerRelay.toggleBlur.subscribe((blur) => {
        this.blurFooter = blur;
      });
  
    }
    
    notifOptions = {
        timeOut: 10000 // 10s
    };
}
