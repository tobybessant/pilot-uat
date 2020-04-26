import { Component, Input } from "@angular/core";

@Component({
  selector: "app-exit-project-button",
  templateUrl: "./exit-project-button.component.html",
  styleUrls: ["./exit-project-button.component.scss"]
})
export class ExitProjectButtonComponent {

  @Input()
  public data: { label: string, callback(): void };

  constructor() { }
}
