import { Component, OnInit } from '@angular/core';
import {ItemListComponent} from "../shared/item-list/item-list.component";
import { Estate } from "../models/estate";
import { EstatesService } from "./estates.service";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss']
})
export class EstatesComponent implements OnInit {

  data: Estate;
  constructor(private es: EstatesService) {
  }

  ngOnInit() {
    this.es.find()
      .subscribe((d) => {this.data = d; console.log(d)}, (err) => {console.error(err)})
  }

}
