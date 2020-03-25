import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestStepDialogComponent } from './edit-test-step-dialog.component';

describe('EditTestStepDialogComponent', () => {
  let component: EditTestStepDialogComponent;
  let fixture: ComponentFixture<EditTestStepDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTestStepDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTestStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
