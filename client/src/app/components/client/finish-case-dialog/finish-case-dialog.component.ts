import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { ActivatedRouteSnapshot, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-finish-case-dialog",
  templateUrl: "./finish-case-dialog.component.html",
  styleUrls: ["./finish-case-dialog.component.scss"]
})
export class FinishCaseDialogComponent {

  @Input()
  public caseName: string = "";

  @Input()
  public projectUrl: string = "/";

  constructor(protected dialogRef: NbDialogRef<any>, private route: ActivatedRoute, private router: Router) {
  }

  close() {
    this.dialogRef.close();
  }

  public backToProject(): void {
    this.close();
    this.router.navigate([this.projectUrl]);
  }
}
