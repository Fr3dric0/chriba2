import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  _elem: any;
  _type: any;
  _showMap: boolean;
  _innerContent: any;
  @Input()
   set elem(e){ this._elem = e}
   get elem(){ return this._elem}
  @Input()
   set type(t){ this._type = t}
   get type(){ return this._type}
  @Input()
   set showMap(s){ this._showMap = s }
   get showMap(){ return this._showMap }
  @Input()
   set innerContent(i){ this._innerContent = i }
   get innerContent(){ return this._innerContent }

  visible: boolean = false;
  breakpoint: number = 600;


    constructor() {
    }

    ngOnInit() {
      const w = window.innerWidth;

      this.visible = (w >= this.breakpoint);
    }

  onResize(event) {
    const w = event.target.innerWidth;

    this.visible = (w >= this.breakpoint);
  }
}
