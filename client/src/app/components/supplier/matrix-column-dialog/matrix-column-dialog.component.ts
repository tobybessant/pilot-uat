import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { IResultsMatrixData } from "src/app/models/api/response/supplier/results-matrix.interface";

@Component({
  selector: "app-matrix-column-dialog",
  templateUrl: "./matrix-column-dialog.component.html",
  styleUrls: ["./matrix-column-dialog.component.scss"]
})
export class MatrixColumnDialogComponent implements OnInit {

  @Input()
  public matrixClients: IResultsMatrixData[] = [];

  @Input()
  public selectedClients: string[] = [];

  public selectionMap: any[] = [];

  private selectedCount: number;

  constructor(private dialogRef: NbDialogRef<any>) { }

  ngOnInit(): void {
    this.matrixClients.forEach(u => {
      const data = {
        user: u,
        selected: this.selectedClients.includes(u.id)
      };

      this.selectionMap.push(data);
    });

    this.selectedCount = this.selectedClients.length;
  }

  public save() {
    this.dialogRef.close(this.selectionMap.map(s => {
      if (s.selected) {
        return s.user.id;
      }
      return;
    }));
  }

  public close() {
    this.dialogRef.close(this.selectedClients);
  }

  public isSelected(user: IResultsMatrixData) {
    return this.selectedClients.includes(user.id);
  }

  public calculateSelected() {
    this.selectedCount = this.selectionMap.filter(s => s.selected).length;
    console.log(this.selectedCount);
  }
}
