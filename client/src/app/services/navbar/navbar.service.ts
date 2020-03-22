import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NavbarService {

  private isViewingProject: boolean = false;
  private header: string = "Pilot";

  constructor() { }

  public setHeader(newHeader: string): void {
    this.header = newHeader;
  }

  public getHeader(): string {
    return this.header;
  }

  public clearHeader() {
    this.header = "Pilot";
  }

  public setIsViewingProject(viewing: boolean) {
    this.isViewingProject = viewing;
  }

  public getIsViewingProject() {
    return this.isViewingProject;
  }
}
