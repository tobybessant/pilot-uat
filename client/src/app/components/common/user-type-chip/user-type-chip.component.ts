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

  public getStyle(): { background: string; color: string; } {
    switch (this.type) {
      case "Client":
        return { background: "var(--color-primary-400)", color: "white" };
      default:
        return { background: "var(--color-primary-transparent-100)", color: "black" };
    }
  }

}
