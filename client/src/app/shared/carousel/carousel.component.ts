/**
 * Created by toma2 on 22.01.2017.
 */
import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ['./carousel.component.scss']
  
})

export class CarouselComponent implements OnInit {

  private _images;
  @Input()
  set images(images:any){
    if (typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img, description: undefined, url: undefined};
      })
    }
    
    this._images = images;
  }
  get images() {
    return this._images;
  }
  
  constructor() {
      
  }
  
  ngOnInit() {
    
  }
  
}

