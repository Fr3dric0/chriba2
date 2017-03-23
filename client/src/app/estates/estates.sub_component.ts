import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-estates-sub',
  templateUrl: './estates.sub_component.html',
  styleUrls: ['./estates.sub_component.scss']
})
export class EstatesSubComponent implements OnInit {

  _elem: any;
  @Input('elem')
  set elem(elem){ this._elem = elem}
  get elem(){ return this._elem}

  constructor() {
  }

  ngOnInit() {
  }

}
