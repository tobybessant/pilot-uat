import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishCaseDialogComponent } from './finish-case-dialog.component';

describe('FinishCaseDialogComponent', () => {
  let component: FinishCaseDialogComponent;
  let fixture: ComponentFixture<FinishCaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishCaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
