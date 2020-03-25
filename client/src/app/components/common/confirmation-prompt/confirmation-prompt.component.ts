import { Component, Input, OnDestroy } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-confirmation-prompt",
  templateUrl: "./confirmation-prompt.component.html",
  styleUrls: ["./confirmation-prompt.component.scss"]
})
export class ConfirmationPromptComponent {

  @Input()
  confirmButtonText: string = "";

  @Input()
  bodyText: string = "";

  @Input()
  confirmAction: (...args: any[]) => void;

  @Input()
  cancelAction: () => void;

  constructor(protected dialogRef: NbDialogRef<any>) {
  }

  close() {
    this.dialogRef.close();
  }
}
