/**
 * Created by Ruben Johannessen on 06.02.2017.
 */
import {Component, OnInit, Input } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit{
  @Input() lat: number;
  @Input() lng: number;

  ngOnInit(){ }
}
