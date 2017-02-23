import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

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
