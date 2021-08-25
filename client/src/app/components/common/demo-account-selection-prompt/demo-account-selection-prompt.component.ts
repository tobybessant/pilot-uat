import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-demo-account-selection-prompt',
  templateUrl: './demo-account-selection-prompt.component.html',
  styleUrls: ['./demo-account-selection-prompt.component.scss']
})
export class DemoAccountSelectionPromptComponent implements OnInit {

  constructor(private dialogRef: NbDialogRef<any>) { }

  ngOnInit(): void {
  }

  public selectClient(): void {
    this.dialogRef.close("Client");
  }

  public selectSupplier(): void {
    this.dialogRef.close("Supplier");
  }
}
