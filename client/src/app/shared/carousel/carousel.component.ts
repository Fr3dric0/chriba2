/**
 * Created by toma2 on 22.01.2017.
 */
import { Component, Input } from '@angular/core';

declare let PhotoSwipe: any;
declare let PhotoSwipeUI_Default: any;

@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ['./carousel.component.scss'],
})

export class CarouselComponent {
  fullScreen: boolean = false;
  
  constructor() {
  
  }
  
  private _images;
  @Input()
  set images(images: any) {
    
    if (images && typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img: img, description: undefined, url: undefined}
      })
    }
    this._images = images;
    this.initGallery();
  }
  
  /**
   * Expected: Returns a list of imageobjects describes above
   * @returns {any}
   */
  get images() {
    return this._images;
  }
  
  initGallery() {
    if (!this.images) {
      return;
    }
    
    let pswpElement = document.querySelectorAll('.pswp')[0];

    // TODO add caption
// build items array
    let items = this.images.map((elem) => {
      if (!elem.img) {
        elem.img = '/resources/defined.gif';
      }
      
      if (!elem.description) {
        elem.description = '';
      }
      
      return {
        h: 400,
        w: 600,
        src: elem.img,
        title: elem.description
      };
    });
    
    // define options
    let options = {
      // Includes caption (description) to each image
      captionEl: true,
      
      // Removes close button
      closeEl: false,
      // Prevent the carousel from closing when clicking anything but close-btn
      closeElClasses: [],
      
      // Prevent closing when swiping vertical
      // because of carousel "closing" when not in fullscreen
      closeOnVerticalDrag: false,
  
      index: 0, // start at first slide
  
      // preventing user to close carousel when clicking on a image
      tapToClose: false,
      
    };

// Initializes and opens PhotoSwipe
    /**
     * Initializes and opens Photoswipe (Carousel)
     * pswpElement is the outer container for the carousel
     * PhotoSwipeUI_Default is the layout for toolbar, buttons etc.
     * {items} Array   is the images
     * {options} Object   is the options for the carousel
     */
    let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  
    // Overkjører funksjonene slik at den ikke lukkes og ødelegges når du prøver å lukke den.
    gallery.close = function() {
      return;
    };
    
    gallery.destroy = function() {
      return;
    };
    
    gallery.listen('close', function() {
      console.log('closed');
    });
    
    gallery.listen('destroy', function() {
      console.log('destroyed');
    });
    
    gallery.listen('resize', () => {
      this.fullScreen = !this.fullScreen;
    });
  }
  
}
