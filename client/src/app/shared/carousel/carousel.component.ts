/**
 * Created by toma2 on 22.01.2017.
 */
import { Component, Input } from '@angular/core';
import { ThumbnailService } from "../general/thumbnails.service";


@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ['./carousel.component.scss']
})

export class CarouselComponent{
window:any;
pointer = [0,1,2];
  
  private _images;
  @Input()
  set images(images: any) {
    if ( images && typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img, description: undefined, url: undefined};
      })
    }
    
    this._images = images;
  }
  get images() {
    return this._images;
  }
  
  constructor(private ts: ThumbnailService) {
  
  }
  
  updateWindow() {
    this.window = [this.images[this.pointer[0]], this.images[this.pointer[1]], this.images[this.pointer[2]]];
  }
  
  next() {
    for (let i = 0; i < 3; i++) {
      this.pointer[i]++;
      if (this.pointer[i] + 1 > this.images.length) {
        this.pointer[i] = 0;
      }
    }
    
    this.updateWindow()
  }
  
  prev() {
    for (let i = 0; i < 3; i++) {
      this.pointer[i]--;
      if (this.pointer[i] < 0) {
        this.pointer[i] = this.images.length - 1;
      }
    }
    
    this.updateWindow()
  }
  
}



