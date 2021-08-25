import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoAccountSelectionPromptComponent } from './demo-account-selection-prompt.component';

describe('DemoAccountSelectionPromptComponent', () => {
  let component: DemoAccountSelectionPromptComponent;
  let fixture: ComponentFixture<DemoAccountSelectionPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoAccountSelectionPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoAccountSelectionPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
