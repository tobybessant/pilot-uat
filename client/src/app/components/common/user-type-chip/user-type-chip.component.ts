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
        return { background: "var(--color-basic-600)", color: "white" };
      default:
        return { background: "#8a51c4", color: "white" };
    }
  }

}
