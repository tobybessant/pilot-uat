import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from "@angular/core";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { NbMenuItem, NbMenuService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-test-suite-list-client",
  templateUrl: "./test-suite-list.component.html",
  styleUrls: ["./test-suite-list.component.scss"]
})
export class ClientTestSuiteListComponent implements OnInit, OnDestroy {

  private _suites: ISuiteResponse[] = [];

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
          this.suiteSelected.emit(item.data.id);
        }
      });

    this.suiteSelected.emit(this._suites[0]?.id);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private mapAndAddSuitesToItems(suites: ISuiteResponse[] = []) {
    const suiteItems = suites.map(s => ({
      title: s.title,
      data: {
        id: s.id
      }
    }) as NbMenuItem);

    this.suitesMenuItems = suiteItems;
  }

}
