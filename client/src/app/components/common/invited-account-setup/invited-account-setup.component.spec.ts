import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InvitedAccountSetupComponent } from "./invited-account-setup.component";

describe("InvitedAccountSetupComponent", () => {
  let component: InvitedAccountSetupComponent;
  let fixture: ComponentFixture<InvitedAccountSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitedAccountSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedAccountSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
