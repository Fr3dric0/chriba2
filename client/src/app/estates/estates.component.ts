import { Component, OnInit } from '@angular/core';
import { Estate } from "../models/estate";
import { EstatesService } from "./estates.service";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss']
})
export class EstatesComponent implements OnInit {

  data: Estate[];
  constructor(private es: EstatesService) {
  }

  ngOnInit() {
    this.es.find()
      .subscribe((d) => {this.data = d.map(EstatesComponent.parseInnerContent)}, (err) => {console.error(err)});
  }

  static parseInnerContent(elem) {
    elem.innerContent = `
      <div class="label area">Adresse</div>
      <div class="info address">${elem.location.address} ${elem.location.addressNumber ? elem.location.addressNumber : ''}</div>
      <div class="info address"> ${elem.location.postalCode ? elem.location.postalCode : ''} ${elem.location.city ? elem.location.city : ''}</div>`;
    if (elem.size) {
      elem.innerContent += `<div class="label area">Areal</div>
      <div class="info area">${elem.size} kvm</div>`;
    }
    return elem;
  }
}
