import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStepListComponent } from './test-step-list.component';

describe('TestStepListComponent', () => {
  let component: TestStepListComponent;
  let fixture: ComponentFixture<TestStepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestStepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
