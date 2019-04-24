import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizQuestionHelperComponent } from './quiz-question-helper.component';

describe('QuizQuestionHelperComponent', () => {
  let component: QuizQuestionHelperComponent;
  let fixture: ComponentFixture<QuizQuestionHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizQuestionHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizQuestionHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
