
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../shared/general/general.service'
import { ThumbnailService } from '../shared/general/thumbnails.service';
import { ChribaTitleService } from '../shared/chriba-title.service';
import { FooterRelayService } from "../shared/footer/footer-relay.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public description : String;
  images: any;

  constructor(private gs: GeneralService,
              private ts: ThumbnailService,
              private titleService: ChribaTitleService,
              private footerRelay: FooterRelayService) {
  }
  
  /**
   * Togggle style for footer from event when fullscreen is initiated or not
   * @param event {boolean}
   */
  toggleFullscreen(event) {
    this.footerRelay.setBlur(event);
  }

  ngOnInit() {
    this.titleService.setTitle(); // Use only the Root-title

    this.ts.generate()
        .then( data => this.images = data )
        .catch( err => console.error(err));

    const sub = this.gs.find().subscribe(
        (data) => {
          this.description = data.description;
          sub.unsubscribe();
        },
        err => console.error(err));

  }

}
