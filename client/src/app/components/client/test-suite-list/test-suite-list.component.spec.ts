import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClientTestSuiteListComponent } from "./test-suite-list.component";

describe("TestSuiteListComponent", () => {
  let component: ClientTestSuiteListComponent;
  let fixture: ComponentFixture<ClientTestSuiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTestSuiteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTestSuiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
