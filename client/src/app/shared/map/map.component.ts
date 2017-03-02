/**
 * Created by Ruben Johannessen on 06.02.2017.
 */
import {Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit{
  @Input() lat: number;
  @Input() long: number;

  ngOnInit(){ }
}
