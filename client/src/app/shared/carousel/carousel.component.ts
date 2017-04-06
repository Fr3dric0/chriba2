/**
 * Created by toma2 on 22.01.2017.
 */
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ['./carousel.component.scss']
})

export class CarouselComponent {
  carouselFrame:any = ["", "", ""];
  pointer = [0,1,2];
  badges = [];
  viewedClass = "viewed";
  width = window.innerWidth;
  fullScreen = false;
  
  /**
   * imageobjects: {img: string, description: string, url: string}
   * Set imagesobjects in _images from input
   * When images is loaded, this.prev() changes the pointers index to 0
   * and updates the frame, updateFrame() for then creating all the badges
   * with createBadgeIndex().
   *
   */
  private _images;
  @Input()
  set images(images: any) {
    if ( images && typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img: img, description: undefined, url: undefined}
      })
    }
    
    this._images = images;
    if (this.images) {
      this.prev();
      this.updateFrame();
      this.createBadgeIndex();
      //setTimeout(this.next, 2000); // for autoscrolling
    }
  }
  
  /**
   * Expected: Returns a list of imageobjects describes above
   * @returns {any}
   */
  get images() {
    return this._images;
  }
  
  /**
   * obj = {img: string, description: string, url: string}
   * (or obj = imageobject in _images)
   * carouselFrame = [obj, obj, obj]
   * Updates the carouselFrame depending on indexes in this.pointer
   */
  updateFrame() {
    this.viewedClass = "cur-image";
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
      
      this.updateFrame();
  }
  
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
  
  /**
   * Returns the backgroundcolor for each badge depending of which image
   * that is in focus. If the badge's index <badgeIndex> is selected to be displayed:
   * this.pointer[1], otherwise make the background transparent
   * @param badgeIndex
   * @returns {any}
   */
  getBgColor(badgeIndex) {
    return badgeIndex == this.pointer[1];
  }
  
  /**
   * Returns the height in px depending on current carousel width (this.width)
   * @returns {string}
   */
  getHeight(this) {
    let precentage = 0.56; // 16:9 ratio, height is 56 % of width
    if (this.width != 0 && this.width * precentage < 1200) {
      return (this.width * precentage).toString();
    }
    
    return (this.innerWidth * precentage).toString();
  }
  
  
  /**
   * On resizing window, sets this.width equal to current carousel's width
   * @param event
   */
  onResize(event) {
    this.width = event.target.innerWidth;
  }
  
  fullscreen() {
    if (this.fullScreen) {
      this.viewedClass = "viewed";
      this.fullScreen = false;
    } else {
      this.viewedClass = "viewed fullscreen";
      this.fullScreen = true;
    }
  }
  
  
  
}



