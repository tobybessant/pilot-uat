import { Component, OnInit, ViewChild } from "@angular/core";
import { NbPopoverDirective } from "@nebular/theme";

@Component({
  selector: "app-password-protocol-tooltip",
  templateUrl: "./password-protocol-tooltip.component.html",
  styleUrls: ["./password-protocol-tooltip.component.scss"]
})
export class PasswordProtocolTooltipComponent implements OnInit {

  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  password: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  public open() {
    this.popover.show();
  }

  public close() {
    this.popover.hide();
  }

  public passwordDoesContainUppercase(): boolean {
    const r = /[A-Z]/;
    return r.test(this.password);
  }

  public passwordDoesContainLowercase(): boolean {
    const r = /[a-z]/;
    return r.test(this.password);
  }

  public passwordDoesContainNumber(): boolean {
    const r = /[0-9]/;
    return r.test(this.password);
  }

  public getPasswordProtocolIcon(valid: boolean): string {
    return valid ? "checkmark-circle-2-outline" : "close-outline";
  }

  public getPasswordProtocolIconColour(valid: boolean): string {
    return valid ? "var(--color-success-500)" : "var(--color-danger-500)";
  }

  public passwordPassesProtocols(): boolean {
    return this.passwordDoesContainLowercase()
      && this.passwordDoesContainUppercase()
      && this.passwordDoesContainNumber()
      && this.password.length >= 8;
  }

}
