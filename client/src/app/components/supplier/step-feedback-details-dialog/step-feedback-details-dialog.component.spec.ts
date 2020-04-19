import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFeedbackDetailsDialogComponent } from './step-feedback-details-dialog.component';

describe('StepFeedbackDetailsDialogComponent', () => {
  let component: StepFeedbackDetailsDialogComponent;
  let fixture: ComponentFixture<StepFeedbackDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepFeedbackDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepFeedbackDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
