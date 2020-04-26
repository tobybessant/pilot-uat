import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BasicNavButtonComponent } from "./basic-nav-button.component";

describe("BasicNavButton", () => {
  let component: BasicNavButtonComponent;
  let fixture: ComponentFixture<BasicNavButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicNavButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicNavButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
