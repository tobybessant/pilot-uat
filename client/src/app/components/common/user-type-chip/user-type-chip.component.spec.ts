import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserTypeChipComponent } from "./user-type-chip.component";

describe("UserTypeChipComponent", () => {
  let component: UserTypeChipComponent;
  let fixture: ComponentFixture<UserTypeChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypeChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypeChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
