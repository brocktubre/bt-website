import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousBrewsComponent } from './previous-brews.component';

describe('PreviousBrewsComponent', () => {
  let component: PreviousBrewsComponent;
  let fixture: ComponentFixture<PreviousBrewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousBrewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousBrewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
