import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClientTestSuiteComponent } from "./test-suite.component";

describe("TestSuiteComponent", () => {
  let component: ClientTestSuiteComponent;
  let fixture: ComponentFixture<ClientTestSuiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTestSuiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTestSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
