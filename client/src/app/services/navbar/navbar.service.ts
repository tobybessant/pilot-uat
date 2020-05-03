import { Injectable } from "@angular/core";
import { LeftNavButton } from "src/app/components/common/nav/nav-left-button";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class NavbarService {

  private DEFAULT_HEADER = "Pilot";

  private leftButton: LeftNavButton;
  private leftButtonSubject: Subject<LeftNavButton>;

  private header: string = this.DEFAULT_HEADER;

  constructor() { 
    this.leftButtonSubject = new Subject<LeftNavButton>();
  }

  public get $leftButton() {
    return this.leftButtonSubject.asObservable();
  }

  public setHeader(newHeader: string): void {
    this.header = newHeader;
  }

  public getHeader(): string {
    return this.header;
  }

  public resetHeader() {
    this.setHeader(this.DEFAULT_HEADER);
  }

  public setActiveButton(btn: LeftNavButton | null) {
    this.leftButton = btn;
    this.leftButtonSubject.next(this.leftButton);
  }

  public getActiveButton(): LeftNavButton | null {
    return this.leftButton;
  }
}
