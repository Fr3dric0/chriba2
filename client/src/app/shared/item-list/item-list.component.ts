import { Component, OnInit, Input } from '@angular/core';
import { Estate } from '../../models/estate'
import { Project } from '../../models/project'

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @Input('elem') _elem: Estate | Project;
  set elem(e){ this._elem = e}
  get elem(){ return this._elem}

  @Input('type') _type: string;
  set type(t){ this._type = t}
  get type(){ return this._type}

  @Input('showMap') _showMap: boolean;
  set showMap(s){ this._showMap = s }
  get showMap(){ return this._showMap }

  @Input('innerContent') _innerContent: any;
  set innerContent(i){ this._innerContent = i }
  get innerContent(){ return this._innerContent }


  expanded: boolean = false;
  breakpoint: number = 600;


    constructor() {
    }

    ngOnInit() {
      const w = window.innerWidth;

      this.expanded = (w >= this.breakpoint);
    }

  onResize(event) {
    const w = event.target.innerWidth;

    this.expanded = (w >= this.breakpoint);
  }
}
