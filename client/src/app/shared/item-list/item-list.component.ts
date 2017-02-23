import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  _list: any;
  @Input()
   set list(l){ this._list = l}
   get list(){ return this._list}

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
