import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { ISuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { NbMenuItem, NbMenuService } from "@nebular/theme";
import { SuiteApiService } from "src/app/services/api/suite-api.service";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-test-case-list",
  templateUrl: "./test-case-list.component.html",
  styleUrls: ["./test-case-list.component.scss"]
})
export class TestCaseListComponent implements OnInit, OnDestroy {

  @Input()
  public set suitesData(data: ISuiteResponse[]) {
    this.mapAndAddSuitesToItems(data);
  }

  @Output()
  public suiteSelected = new EventEmitter<string>();

  @Output()
  public suiteAdded = new EventEmitter<string>();

  public newSuiteName: string = "";
  public suites: NbMenuItem[] = [];

  private alive: boolean = true;
  private isAddingSuite: boolean = false;

  @ViewChild("suiteNameInput")
  suiteNameInputRef: ElementRef<HTMLInputElement>;

  constructor(private nbMenuService: NbMenuService) { }

  ngOnInit(): void {
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "test-suites"),
        map(({ item }) => item)
      )
      .subscribe(item => {
        if (this.alive) {
          this.suiteSelected.emit(item.data.id);
        }
      });

    // this.mapAndAddSuitesToItems(this.suitesData);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private mapAndAddSuitesToItems(suites: ISuiteResponse[] = []) {
    const suiteItems = suites.map(s => ({
      title: s.suiteName,
      data: {
        id: s.id
      }
    }) as NbMenuItem);

    this.suites = suiteItems;
  }

  public getIsAddingSuite(): boolean {
    return this.isAddingSuite;
  }

  public setIsAddingSuite(value: boolean): void {
    if (value === true) {
      setTimeout(() => this.suiteNameInputRef.nativeElement.focus());
      this.newSuiteName = "";
    }

    this.isAddingSuite = value;
  }

  public async addSuite(): Promise<void> {
    if (this.newSuiteName) {
      this.suiteAdded.emit(this.newSuiteName);
      this.newSuiteName = "";
    }
  }
}
