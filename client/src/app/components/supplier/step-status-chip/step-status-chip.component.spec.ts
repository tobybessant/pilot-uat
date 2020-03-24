import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StepStatusChipComponent } from "./step-status-chip.component";

describe("StepStatusChipComponent", () => {
  let component: StepStatusChipComponent;
  let fixture: ComponentFixture<StepStatusChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepStatusChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
