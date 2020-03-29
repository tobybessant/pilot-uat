import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClientTestStepListComponent } from "./test-step-list.component";

describe("TestStepListComponent", () => {
  let component: ClientTestStepListComponent;
  let fixture: ComponentFixture<ClientTestStepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTestStepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTestStepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
