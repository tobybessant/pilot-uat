import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestSuiteListComponent } from "./test-suite-list.component";

describe("TestSuiteListComponent", () => {
  let component: TestSuiteListComponent;
  let fixture: ComponentFixture<TestSuiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSuiteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
