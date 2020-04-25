import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StepWizardComponent } from "./step-wizard.component";

describe("StepWizardComponent", () => {
  let component: StepWizardComponent;
  let fixture: ComponentFixture<StepWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
