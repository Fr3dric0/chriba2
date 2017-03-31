/**
 * Created by toma2 on 22.01.2017.
 */
import { Component, Input} from '@angular/core';
import { ThumbnailService } from "../general/thumbnails.service";


@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ['./carousel.component.scss']
})

export class CarouselComponent {
  carouselFrame:any = ["", "", ""];
  pointer = [0,1,2];
  badges = [];
  
  
  /**
   * imageobjects: {img: string, description: string, url: string}
   * Set imagesobjects in _images from input
   */
  private _images;
  @Input()
  set images(images: any) {
    if ( images && typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img, description: undefined, url: undefined}
      })
    }
    
    this._images = images;
    
    if (this.images) {
      this.updateFrame();
      this.createBadgeIndex();
    }
    
  }
  
  /**
   * Expected: Returns a list of imageobjects describes above
   * @returns {any}
   */
  get images() {
    return this._images;
  }
  
  constructor(private ts: ThumbnailService) {
  
  }
  
  /**
   * obj = {img: string, description: string, url: string}
   * (or obj = imageobject in _images)
   * carouselFrame = [obj, obj, obj]
   * Updates the carouselFrame depending on indexes in this.pointer
   */
  updateFrame() {
    this.carouselFrame = [this.images[this.pointer[0]], this.images[this.pointer[1]], this.images[this.pointer[2]]];
  }
  
  /**
   * Changes the pointers indexes so the next image is displayed
   * Then updates the "window frame" with the previous, current and next image
   */
  next() {
    for (let i = 0; i < 3; i++) {
      this.pointer[i]++;
      if (this.pointer[i] + 1 > this.images.length) {
        this.pointer[i] = 0;
      }
    }
    
    this.updateFrame();
  }
  
  /**
   * Changes the pointers indexes so the previous image is displayed
   * Then updates the "window frame" with the previous, current and next image
   */
  prev() {
    for (let i = 0; i < 3; i++) {
      this.pointer[i]--;
      if (this.pointer[i] < 0) {
        this.pointer[i] = this.images.length - 1;
      }
    }
    
    this.updateFrame()
  }
  
  // Change pointers indexes depending on which badge
  // that has been clicked
  /**
   * Receives badgeIndex from current clicked or selected badge
   * Changes which image to display correspondingly
   * Checks for previous index and next index to avoid error and index out of bounds
   * Updates the frame for the carousel
   * Updates the backgroundcolor for badges
   * @param badgeIndex
   */
  viewImage(badgeIndex) {
    let prevIdx = badgeIndex - 1;
    let nextIdx = badgeIndex + 1;
    if (prevIdx < 0) {
      prevIdx = this.images.length - 1;
    }
    
    if (nextIdx >= this.images.length) {
      nextIdx = 0;
    }
    
    this.pointer = [prevIdx, badgeIndex, nextIdx];
    this.updateFrame();
    this.getBgColor(badgeIndex)
  }
  
  /**
   * Creates same amount of badges as there are images
   * These are saved in this.badges
   */
  createBadgeIndex() {
    for (let i = 0; i < this.images.length; i++) {
      this.badges.push(i);
    }
  }
  
  // return the backgroundscolor for each badge depended of which image
  // that are in the focus
  /**
   * Returns the backgroundcolor for each badge depending of which image
   * that are in focus. If the badges index's <badgeIndex> is selected to be displayed:
   * this.pointer[1], otherwise make the background transparent
   * @param badgeIndex
   * @returns {any}
   */
  getBgColor(badgeIndex) {
    if (badgeIndex == this.pointer[1]) {
      return 	"#F5F5F5";
    } else {
      return "transparent";
    }
  }
}



