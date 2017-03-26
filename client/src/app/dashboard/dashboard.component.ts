import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../shared/general/general.service'
import { ThumbnailService } from "../shared/general/thumbnails.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public description : String;
  images: any;
  
  constructor(private gs: GeneralService,
              private ts: ThumbnailService) {
  }

  ngOnInit() {
    
    this.ts.generate()
      .then( data => this.images = data)
      .catch( err => console.error(err));
    
    const sub = this.gs.getAbout()
      .subscribe((data) => {
        this.description = data.description;
      sub.unsubscribe();
      },
        err => console.error(err));
    
  }
  
  
}
