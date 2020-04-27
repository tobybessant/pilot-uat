import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-finish-case-dialog",
  templateUrl: "./finish-case-dialog.component.html",
  styleUrls: ["./finish-case-dialog.component.scss"]
})
export class FinishCaseDialogComponent {

  @Input()
  public caseName: string = "";

  constructor(protected dialogRef: NbDialogRef<any>) {
  }

  close() {
    this.dialogRef.close();
  }
}
