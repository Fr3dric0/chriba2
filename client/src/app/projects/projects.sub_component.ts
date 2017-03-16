import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-projects-sub',
  templateUrl: './projects.sub_component.html',
  styleUrls: ['./projects.sub_component.css', './../../stylesheets/material-buttons.scss']
})
export class ProjectsSubComponent implements OnInit {

  _elem: any;
  @Input('elem')
  set elem(elem){ this._elem = elem}
  get elem(){ return this._elem}

  constructor() {
  }

  ngOnInit() {
  }

}
