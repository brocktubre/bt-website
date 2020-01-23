import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cuhackit2020Component } from './cuhackit2020.component';

describe('Cuhackit2020Component', () => {
  let component: Cuhackit2020Component;
  let fixture: ComponentFixture<Cuhackit2020Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cuhackit2020Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cuhackit2020Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
