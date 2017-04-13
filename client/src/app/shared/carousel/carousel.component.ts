/**
 * Created by toma2 on 22.01.2017.
 */
import { Component, Input, trigger, state, style, animate, transition } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('imageState', [
      state('inactive', style({
        opacity: 0
      })),
      state('active',   style({
        opacity: 1
      })),
      transition('inactive => active, active => inactive',
        animate('100ms ease-out'))
    ])
  ]
})

export class CarouselComponent {
  carouselFrame:any = ["", "", ""];
  pointer = [0,1,2];
  badges = [];
  viewedClass = "viewed";
  fullWidth = window.innerWidth;
  imgState = "active";
  fullScreen = "disappear";
  fullScreenBackground = "";
  descClass = "";
  fullScreenBtn = "";
  standBy = true;
  
  /**
   * imageobjects: {img: string, description: string, url: string}
   * Set imagesobjects in _images from input
   * When images is loaded, this.prev() changes the pointers index to 0
   * and updates the frame, updateFrame() for then creating all the badges
   * with createBadgeIndex().
   *
   * setInterval starts a loop as long as the carousel is on standby.
   * standBy is true when initializing and the interval scrolls every 10 secs
   * as long as standBy is true.
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
      setInterval(() => this.standBy ? this.next() : "", 10000);
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
   * Updates the carouselFrame depending on index in this.pointer
   */
  updateFrame() {
    this.changeImgState();
    setTimeout(() =>  this.changeImgState(), 100);
    setTimeout(() => this.carouselFrame =
      [
        this.images[this.pointer[0]],
        this.images[this.pointer[1]],
        this.images[this.pointer[2]]
      ], 100);
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
   * Checks for previous and next index to avoid error and index out of bounds
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
   * Returns the height in px depending on current carousel width (this.fullWidth)
   * @returns {string}
   */
  getHeight(this) {
    let percentage = 0.56; // 16:9 ratio, height is 56 % of width
    if (this.fullWidth != 0 && this.fullWidth * percentage < 1200) {
      return (this.fullWidth * percentage).toString();
    }
    return (this.fullWidth * percentage).toString();
  }
  
  /**
   * Return the bottom value for badges depening on wether the carousel is
   * in fullscreen or not.
   * @returns {string}
   */
  getBottomValue() {
    return this.fullScreen.includes("fullscreen") ? "0" : "3em";
  }
  
  
  /**
   * On resizing window, sets this.width equal to current carousel's width
   * @param event
   */
  onResize(event) {
    this.fullWidth = event.target.innerWidth;
  }
  
  /**
   * Changes the class for the fullscreen container, description, button and
   * background depending on wether there is fullscreen in the class or not,
   * also, changes wether the image should load or not by adding and removing
   * the source src.
   */
  
  fullscreen() {
    this.fullScreen.includes("fullscreen") ? (
        this.fullScreen = "disappear",
        this.fullScreenBackground = "",
        this.viewedClass = "viewed",
        this.descClass = "",
        this.fullScreenBtn = ""
    ) : (
        this.fullScreen = "fullscreen",
        this.fullScreenBackground = "background",
        this.viewedClass = "viewed scale-down",
        this.descClass = "disappear",
        this.fullScreenBtn = "fixed"
    );
  }
  
  /**
   * This function is used to change wether the current (shown) image
   * should be active or not and cooperates with the transitions at the top.
   */
  changeImgState() {
    this.imgState = this.imgState == "active" ? "inactive" : "active";
  }
  
  /**
   * This is for the autoscrolling. Sets the standby to false if the user
   * interacts with the carousel (clicking any buttons).
   * standBy {Boolean}   initialized as true;
   */
  standbyOff() {
    this.standBy = false;
  }
}



