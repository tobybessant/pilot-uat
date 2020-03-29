import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClientTestCaseComponent } from "./test-case.component";

describe("TestCaseComponent", () => {
  let component: ClientTestCaseComponent;
  let fixture: ComponentFixture<ClientTestCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTestCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
