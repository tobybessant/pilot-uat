import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditCaseDialogComponent } from "./edit-case-dialog.component";

describe("EditCaseDialogComponent", () => {
  let component: EditCaseDialogComponent;
  let fixture: ComponentFixture<EditCaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
