import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitProjectButtonComponent } from './exit-project-button.component';

describe('ExitProjectButtonComponent', () => {
  let component: ExitProjectButtonComponent;
  let fixture: ComponentFixture<ExitProjectButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitProjectButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitProjectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
