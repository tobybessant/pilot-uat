import { Component, Input, OnDestroy } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-confirmation-prompt",
  templateUrl: "./confirmation-prompt.component.html",
  styleUrls: ["./confirmation-prompt.component.scss"]
})
export class ConfirmationPromptComponent implements OnDestroy {

  @Input()
  confirmButtonText: string = "";

  @Input()
  bodyText: string = "";

  @Input()
  confirmAction: () => void;

  @Input()
  cancelAction: () => void;

  constructor(protected dialogRef: NbDialogRef<any>) {
  }

  ngOnDestroy(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
