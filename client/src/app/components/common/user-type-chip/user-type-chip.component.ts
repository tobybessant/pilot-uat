import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-user-type-chip",
  templateUrl: "./user-type-chip.component.html",
  styleUrls: ["./user-type-chip.component.scss"]
})
export class UserTypeChipComponent implements OnInit {

  @Input()
  public type: string;

  constructor() { }

  ngOnInit(): void {
  }

  public getBackground(): string {
    switch (this.type) {
      case "Client":
        return "var(--color-success-300)";
      default:
        return "var(--color-primary-transparent-100)";
    }
  }

}
