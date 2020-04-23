import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixColumnDialogComponent } from './matrix-column-dialog.component';

describe('MatrixColumnDialogComponent', () => {
  let component: MatrixColumnDialogComponent;
  let fixture: ComponentFixture<MatrixColumnDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixColumnDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixColumnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
