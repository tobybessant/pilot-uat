import { Component, OnInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { NbSidebarService } from "@nebular/theme";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.sidebarService.toggle(false, "project-sidebar");
    this.cdr.detectChanges();
  }

  constructor(
    private sidebarService: NbSidebarService,
    private cdr: ChangeDetectorRef
  ) { }
}
