import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-demo-account-selection-prompt',
  templateUrl: './demo-account-selection-prompt.component.html',
  styleUrls: ['./demo-account-selection-prompt.component.scss']
})
export class DemoAccountSelectionPromptComponent implements OnInit {

  private readonly clientText: string = "A client account will allow you to see what your users conducting UAT will see.";
  private readonly supplierText: string = "A supplier account will allow you to see what a software supplier can use Pilot to do.";

  public lastHoveredButton: string = "Client";

  public get accountTypeOverview(): string {
    return this.lastHoveredButton === "Client" ? this.clientText : this.supplierText;
  }

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
