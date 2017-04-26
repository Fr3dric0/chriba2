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
  
  private _images;
  @Input()
  set images(images: any) {
    
    if (images && typeof images[0] == "string") {
      this._images = images.map((img) => {
        return {img: img, description: '', url: ''}
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
  
  /**
   * Initializes and opens Photoswipe (Carousel)
   * pswpElement is the outer container for the carousel
   * PhotoSwipeUI_Default is the layout for toolbar, buttons etc.
   * {items} Array   is the images
   * {options} Object   is the options for the carousel
   */
  initGallery() {
    if (!this.images) {
      return;
    }
    
    let pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    let items = this.images.map((elem) => {
      if (!elem.img) {
        elem.img = '//';
      }
      
      if (!elem.description) {
        elem.description = '';
      }
      
      return {
        h: 600,
        w: 840,
        src: elem.img,
        title: elem.description
      };
    });
    
    // Define options
    let options = {
      // Includes caption (description) to each image
      captionEl: true,
      
      // Removes close button (User closes fullscreen with fullscreen button)
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

    // The initialization
    let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
  
    let realViewportWidth,
      useLargeImages = false,
      firstResize = true,
      imageSrcWillChange;
    
    // beforeResize event fires each time size of gallery viewport updates
    gallery.listen('beforeResize', function() {
      // gallery.viewportSize.x - width of PhotoSwipe viewport
      // gallery.viewportSize.y - height of PhotoSwipe viewport
      // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
      //                          1 (regular display), 2 (@2x, retina) ...
    
    
      // calculate real pixels when size changes
      realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;
    
      // Code below is needed if you want image to switch dynamically on window.resize
    
      // Find out if current images need to be changed
      if(useLargeImages && realViewportWidth < 1200) {
        useLargeImages = false;
        imageSrcWillChange = true;
      } else if(!useLargeImages && realViewportWidth >= 1200) {
        useLargeImages = true;
        imageSrcWillChange = true;
      }
    
      // Invalidate items only when source is changed and when it's not the first update
      if(imageSrcWillChange && !firstResize) {
        // invalidateCurrItems sets a flag on slides that are in DOM,
        // which will force update of content (image) on window.resize.
        gallery.invalidateCurrItems();
      }
    
      if(firstResize) {
        firstResize = false;
      }
    
      imageSrcWillChange = false;
    
    });
    
    gallery.init();
  
    // Overkjører funksjonene slik at den ikke lukkes og ødelegges når du prøver å lukke den.
    // Overrides close and destroy function so that the carousel either closes
    /**
     * Overrides close and destroy functions
     */
    gallery.close = function() {
      return;
    };
    
    gallery.destroy = function() {
      return;
    };
    
    gallery.listen('resize', () => {
      this.fullScreen = !this.fullScreen;
    });
  }
}
