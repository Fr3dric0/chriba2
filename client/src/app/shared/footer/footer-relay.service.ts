import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";


@Injectable()
export class FooterRelayService {
  private blurValueChange = new BehaviorSubject<boolean>(false);
  toggleBlur = this.blurValueChange.asObservable();
  
  constructor() {}
  
  setBlur(blur: boolean) {
    this.blurValueChange.next(blur);
  }
}
