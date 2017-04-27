/**
 * Created by Ruben Johannessen on 06.02.2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit{
  private zooming: boolean;
  private defaultUI: boolean = false;
  private shortcuts: boolean;
  private streetView: boolean;
  private scaling: boolean;
  private typeChanging: boolean;
  private fullscreen: boolean;
  private rotate: boolean;

  private mapDone: boolean = false;

  @Input() lat: number;
  @Input() long: number;
  @Input() zoom: number = 9;
  @Input() control: number = 0;

  ngOnInit(){
    if (this.control == 0) {
      this.zooming = true;
      this.shortcuts = false;
      this.streetView = false;
      this.scaling = false;
      this.typeChanging = false;
      this.rotate = false;
      this.fullscreen = true;
    } else if (this.control == 1) {
      this.zooming = true;
      this.shortcuts = true;
      this.streetView = true;
      this.scaling = true;
      this.typeChanging = true;
      this.rotate = true;
      this.fullscreen = true;
    } else {
      this.zooming = false;
      this.defaultUI = true;
      this.shortcuts = false;
      this.streetView = false;
      this.scaling = false;
      this.typeChanging = false;
      this.rotate = false;
      this.fullscreen = false;
    }
    this.mapDone = true;
  }
}
