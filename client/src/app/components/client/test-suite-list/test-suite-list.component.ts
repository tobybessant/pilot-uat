import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { NbMenuItem, NbMenuService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-test-suite-list-client",
  templateUrl: "./test-suite-list.component.html",
  styleUrls: ["./test-suite-list.component.scss"]
})
export class ClientTestSuiteListComponent implements OnInit, OnDestroy {

  private _suites: ISuiteResponse[] = [];
  private selectedSuiteId: string = "";

  private firstLoad: boolean = true;

  @Input()
  public set suitesData(value: ISuiteResponse[]) {
    this._suites = value;
    this.mapAndAddSuitesToItems(value);
  }

  public get suites(): ISuiteResponse[] {
    return this._suites;
  }

  @Output()
  public suiteSelected = new EventEmitter<string>();

  private alive: boolean = true;
  public suitesMenuItems: NbMenuItem[] = [];

  constructor(private nbMenuService: NbMenuService) { }

  ngOnInit(): void {
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "test-suites"),
        map(({ item }) => item)
      )
      .subscribe(item => {
        if (this.alive) {
          this.setSelectedSuite(item.data.id);
          this.mapAndAddSuitesToItems(this._suites);
        }
      });

    this.setSelectedSuite(this._suites[0]?.id);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private mapAndAddSuitesToItems(suites: ISuiteResponse[] = []) {
    const suiteItems = suites.map((s, idx) => ({
      title: s.title,
      data: {
        id: s.id
      },
      selected: (idx === 0 && this.firstLoad) || this.isSelected(s.id)
    }) as NbMenuItem);

    this.firstLoad = false;
    this.suitesMenuItems = suiteItems;
  }

  private setSelectedSuite(id: string): void {
    this.suiteSelected.emit(id);
    this.selectedSuiteId = id;
  }

  private isSelected(id: string): boolean {
    return id === this.selectedSuiteId;
  }
}
