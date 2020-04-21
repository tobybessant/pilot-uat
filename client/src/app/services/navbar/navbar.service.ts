import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NavbarService {

  private DEFAULT_HEADER = "Pilot";
  private isViewingProject: boolean = false;
  private header: string = this.DEFAULT_HEADER;

  constructor() { }

  public setHeader(newHeader: string): void {
    this.header = newHeader;
  }

  public getHeader(): string {
    return this.header;
  }

  public clearHeader() {
    this.setHeader(this.DEFAULT_HEADER);
  }

  public setIsViewingProject(viewing: boolean) {
    this.isViewingProject = viewing;
  }

  public getIsViewingProject() {
    return this.isViewingProject;
  }
}
