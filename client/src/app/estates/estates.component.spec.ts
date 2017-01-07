/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EstatesComponent } from './estates.component';

describe('EstatesComponent', () => {
  let component: EstatesComponent;
  let fixture: ComponentFixture<EstatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
