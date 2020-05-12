import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { CaseApiService } from "src/app/services/api/case/case-api.service";
import { ICaseResponse } from "src/app/models/api/response/supplier/case.interface";

@Component({
  selector: "app-edit-case-dialog",
  templateUrl: "./edit-case-dialog.component.html",
  styleUrls: ["./edit-case-dialog.component.scss"]
})
export class EditCaseDialogComponent implements OnInit {

  @Input()
  public case: ICaseResponse;

  public caseTitleInput: string;

  constructor(protected dialogRef: NbDialogRef<any>, private caseApiService: CaseApiService) { }

  ngOnInit(): void {
    this.caseTitleInput = this.case.title;
  }

  public close() {
    this.dialogRef.close();
  }

  public async saveCase(): Promise<void> {
    if (this.caseTitleInput) {
      this.case.title = this.caseTitleInput;
      const update = await this.caseApiService.updateCase(this.case);
      this.close();
    }
  }
}
