/**
 * Created by Ruben Johannessen on 15.03.2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'details-project',
    templateUrl: './project.component.html',
    styleUrls: ['../subdetails.component.scss']
})
export class ProjectComponent implements OnInit {

    private name: string;
    private title: string;
    private description: string;
    private url: any;
    private images: string[];

    @Input()
    set data({name, title, description, url, thumbnails}) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.url = (
            (new RegExp("^((https|http|ftp|rtsp|mms)+://)+"
                + "(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
                + "(([0-9a-z_!~*'()-]+\.)*"
                + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
                + "[a-z]{2,6})"
                + "(:[0-9]{1,4})?"
                + "((/?)|"
                + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"))
                .test(url) ? new URL(url) : null
        );
        this.images = thumbnails.large;
    }

    constructor() { }
  
    /**
     * Handles the style for footer from event when fullscreen is initiated or not
     * @param event {boolean}
     */
    handleFullscreenUpdated(event) {
      // Getting DOM element with id #footer
      let footer = document.querySelector('.footer');
      if (event && footer) {
        footer.className = "";
      } else if (!event && footer) {
        footer.className = "neg-index";
      }
    }
    
    ngOnInit() { }
}
