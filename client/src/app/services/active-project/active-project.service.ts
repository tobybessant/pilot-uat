import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { IProjectResponse } from "src/app/models/api/response/client/project.interface";

@Injectable({
  providedIn: "root"
})
export class ActiveProjectService {

  private projectSubject = new Subject<IProjectResponse>();
  private activeProject: IProjectResponse;

  constructor() { }

  async setActiveProject(project: IProjectResponse) {
    this.activeProject = project;
    this.projectSubject.next(project);
  }

  public get $(): Observable<IProjectResponse> {
    return this.projectSubject.asObservable();
  }

  public getActiveProject() {
    return this.activeProject;
  }
}
