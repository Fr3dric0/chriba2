/**
 * Created by toma2 on 22.01.2017.
 */
import { Component, Input, HostListener, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

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
  carouselFrame: any = ["", "", ""];
  pointer: any = [0, 1, 2];
  badges = [];
  isFullscreen: boolean = false;
  fullWidth = document.body.clientWidth;
  imgState = "active"; // state for transition effect

  standBy = true; // As long as standBy is true, the carousel autoscrolls

  // Used to determine if analytics should start tracking events
  instantiated: boolean = false;
  
  @Output() fullscreenUpdated = new EventEmitter();

  constructor(private angulartics2: Angulartics2) {}

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
    this._images = images;
    
    if ( images && typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img: img, description: undefined, url: undefined}
      })
    }
    
    if (this.images) {
      this.setPointer();
      this.updateFrame();
      this.createBadgeIndex();
      this.prev(false);
      
      // Sets interval for autoscrolling (Default: 10000 millisec)
      setInterval(() => this.standBy ? this.next(false) : "", 10000);
    }

    this.instantiated = true;
  }

  /**
   * Expected: Returns a list of imageobjects describes above
   * @returns {any}
   */
  get images() {
    return this._images;
  }
  
  @HostListener('document:keydown', ['$event'])
  keypress(e: KeyboardEvent) {
    
    if (this.images && this.images.length > 1) {
      
      if (e.key == "ArrowLeft") {
        this.prev();
      }
      if (e.key == "ArrowRight") {
        this.next();
      }
    }
    
    if (this.isFullscreen && e.key == "Escape") {
      this.fullscreen();
    }
  }
  
  /**
   * This sets the pointer depending on wether the carousel is given 1 or 2 images
   * If the carousel is given 1, then there will be no buttons to change image
   * If the carousel is given 2 or more, then the buttons will appear, but it will
   * change between the two images as shown below
   */
  setPointer() {
    if (this.images.length == 2) {
      this.pointer = [1,0,1];
    } else if (this.images.length == 1) {
      this.pointer = [0,0,0];
    }
  }

  /**
   * obj = {img: string, description: string, url: string}
   * (or obj = imageobject in _images)
   * carouselFrame = [obj, obj, obj]
   * Updates the carouselFrame depending on index in this.pointer
   */
  updateFrame() {
    this.changeImgState();
    setTimeout(() => this.changeImgState(), 100);
    setTimeout(() => {
      this.carouselFrame = [
        this.images[this.pointer[0]],
        this.images[this.pointer[1]],
        this.images[this.pointer[2]]
      ]
    }, 100);
  }

  /**
   * Changes the pointers indexes so the next image is displayed
   * Then updates the "window frame" with the previous, current and next image
   */
  next(stopAuto = true) {
      if (stopAuto) {
        this.standbyOff();
      }
    
      for (let i = 0; i < 3; i++) {
        this.pointer[i]++;
        if (this.pointer[i] + 1 > this.images.length) {
          this.pointer[i] = 0;
        }
      }
      this.updateFrame();


    if (this.instantiated && !this.standBy) {
        this.angulartics2.eventTrack.next({
            action: 'NextImage',
            properties: {
                category: 'carousel',
                label: this.carouselFrame[1] && this.carouselFrame[1].img ?
                    this.carouselFrame[1].img :
                    '[Unknown Image]'
            }
        });
    }
  }

  /**
   * Changes the pointers indexes so the previous image is displayed
   * Then updates the "window frame" with the previous, current and next image
   */
  prev(stopAuto = true) {
    if (stopAuto) {
      this.standbyOff();
    }
    
      for (let i = 0; i < 3; i++) {
        this.pointer[i]--;
        if (this.pointer[i] < 0) {
          this.pointer[i] = this.images.length - 1;
        }
      }

      this.updateFrame();

      if (this.instantiated && !this.standBy) {
          this.angulartics2.eventTrack.next({
              action: 'PreviousImage',
              properties: {
                  category: 'carousel',
                  label: this.carouselFrame[1] && this.carouselFrame[1].img ?
                      this.carouselFrame[1].img :
                      '[Unknown Image]'
              }
          });
      }
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
    this.isSelected(badgeIndex);

    if (this.instantiated && !this.standBy) {
        this.angulartics2.eventTrack.next({
            action: 'ChangeImageThroughBadge',
            properties: {
                category: 'carousel',
                label: this.carouselFrame[1] && this.carouselFrame[1].img ?
                    this.carouselFrame[1].img :
                    '[Unknown Image]'
            }
        });
    }
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
   * Returns if the selected badge (badgeIndex) should have backgroundcolour or not.
   * @param badgeIndex
   * @returns {any}
   */
  isSelected(badgeIndex) {
    return badgeIndex == this.pointer[1];
  }

  /**
   * Returns the height in px depending on current carousel width (this.fullWidth)
   * @returns {string}
   */
  getHeight() {
    if (!this.isFullscreen) {
      let percentage = 0.70; // DEFAULT: 0.70; 16:9 ratio when height is 56 % of width
      if (this.fullWidth != 0 && this.fullWidth * percentage < 1200) {
        return (this.fullWidth * percentage).toString();
      }
      return (this.fullWidth * percentage).toString();
    }
    
  }
  
  /**
   * Returns documents width in px (excluding scrollbar when it's not overlapping)
   * @returns {number}
   */
  getWidth() {
    if (this.isFullscreen) {
      return document.body.offsetWidth;
    }
  }

  /**
   * On resizing window, sets this.width equal to current carousel's width
   * @param event
   */
  onResize() {
    this.fullWidth = document.body.offsetWidth;
  }

  /**
   * Changes the class for the fullscreen container, description, button and
   * background depending on wether there is fullscreen in the class or not,
   * also, changes wether the image should load or not by adding and removing
   * the source src.
   */

  fullscreen() {
    this.standbyOff();
    this.isFullscreen = !this.isFullscreen;
    this.fullWidth = this.fullWidth = document.body.clientWidth;
    this.fullscreenUpdated.emit(this.isFullscreen);

        this.angulartics2.eventTrack.next({
          action: 'ToggleFullscreen',
          properties: {
              category: 'carousel',
              label: this.carouselFrame[1] && this.carouselFrame[1].img ?
                  this.carouselFrame[1].img :
                  '[Unknown Image]'
          }
      });
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
