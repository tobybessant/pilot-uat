import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordProtocolTooltipComponent } from './password-protocol-tooltip.component';

describe('PasswordProtocolTooltipComponent', () => {
  let component: PasswordProtocolTooltipComponent;
  let fixture: ComponentFixture<PasswordProtocolTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordProtocolTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordProtocolTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
