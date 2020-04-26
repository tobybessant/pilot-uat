import { Component, Input } from "@angular/core";

@Component({
  selector: "app-exit-project-button",
  templateUrl: "./basic-nav-button.component.html",
  styleUrls: ["./basic-nav-button.component.scss"]
})
export class BasicNavButtonComponent {

  @Input()
  public data: { label: string, callback(): void };

  constructor() { }
}
